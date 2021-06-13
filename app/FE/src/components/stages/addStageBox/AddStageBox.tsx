import * as Yup from 'yup';
import React, { useContext, useEffect, useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, Typography } from '@material-ui/core';
import { ArrowForward, Image, Movie } from '@material-ui/icons';
import mime from 'mime-types';
import slugify from 'slugify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FormikForm, StyledAlert, StyledDropzoneArea } from '#components/shared';
import { AccountContext } from '#contexts';
import { ENDPOINTS, S3_STAGES_BUCKET_NAME } from '#utils';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  title: '',
  subheader: '',
  body: '',
  externalLink: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Stage title required.'),
  subheader: Yup.string().required('Stage subheader required.'),
  body: Yup.string().required('Stage body text required.'),
  externalLink: Yup.string().url('Stage external link must be a valid URL').required('Stage external link required.'),
});

const AddStageBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const [imageFile, setImageFile] = useState<File>();
  const [videoFile, setVideoFile] = useState<File>();
  const [s3Client, setS3Client] = useState<S3Client>();
  const { getSession } = useContext(AccountContext.Context);

  useEffect(() => {
    const setupClient = async () => {
      try {
        const credentials = fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: process.env.NEXT_PUBLIC_COGNITO_REGION }),
          identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID!,
          logins: {
            [process.env.NEXT_PUBLIC_COGNITO_USER_POOL_PROVIDER!]: (await getSession()).getIdToken().getJwtToken(),
          },
        });
        setS3Client(new S3Client({ region: process.env.NEXT_PUBLIC_COGNITO_REGION, credentials }));
      } catch (e) {
        console.error('🚀  -> file: AddStageBox.tsx  -> line 58  -> e', e);
      }
    };

    setupClient();
  }, []);

  const onSubmit = async ({ title, subheader, body, externalLink }: typeof initialValues) => {
    try {
      if (!imageFile) throw new Error('Stage requires an image.');
      if (!videoFile) throw new Error('Stage requires a video.');

      const SK = slugify(title, { lower: true });
      const imageFileKey = `${SK}/image.${mime.extension(imageFile.type)}`;
      const videoFileKey = `${SK}/video.${mime.extension(videoFile.type)}`;

      // upload image file
      await s3Client!.send(
        new PutObjectCommand({
          Bucket: S3_STAGES_BUCKET_NAME,
          Key: imageFileKey,
          Body: imageFile,
        }),
      );

      // upload video file
      await s3Client!.send(
        new PutObjectCommand({
          Bucket: S3_STAGES_BUCKET_NAME,
          Key: videoFileKey,
          Body: videoFile,
        }),
      );

      // add new stage
      await axios.post(
        ENDPOINTS.STAGES,
        {
          title,
          subheader,
          externalLink,
          body,
          imageLink: `${ENDPOINTS.S3_STAGES_BUCKET}/${imageFileKey}`,
          videoLink: `${ENDPOINTS.S3_STAGES_BUCKET}/${videoFileKey}`,
        },
        { headers: { Authorization: `Bearer ${(await getSession()).getIdToken().getJwtToken()}` } },
      );

      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully created a new stage.
        </StyledAlert>
      ));
      setTimeout(() => router.reload(), 2000);
    } catch (e) {
      console.dir(e);
      // possible errors:
      // - UsernameExistsException
      // - CodeDeliveryFailureException
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  return (
    <FormikForm.StyledFormWrapper>
      <Typography variant="h5" gutterBottom>
        Add a new stage
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        The new stage will be available on the main page, allowing users to interact with it.
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => (
          <>
            <FormikForm.StyledForm>
              <FormikForm.FormikField type="text" name="title" label="Stage title" required />
              <FormikForm.FormikField type="text" name="subheader" label="Stage subheader" required />
              <FormikForm.FormikField type="text" name="body" label="Stage body text" required multiline rowsMax={10} />
              <FormikForm.FormikField type="text" name="externalLink" label="External link" required />
              <StyledDropzoneArea
                fileObjects={imageFile}
                acceptedFiles={['image/*']}
                maxFileSize={5 * 10 ** 6}
                filesLimit={1}
                dropzoneText="Stage image"
                Icon={Image}
                onChange={(imageFiles: File[]) => setImageFile(imageFiles[0])}
              />
              <StyledDropzoneArea
                fileObjects={videoFile}
                acceptedFiles={['video/*']}
                maxFileSize={25 * 10 ** 6}
                filesLimit={1}
                dropzoneText="Stage video"
                Icon={Movie}
                onChange={(videoFiles: File[]) => setVideoFile(videoFiles[0])}
              />

              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                color="primary"
                type="submit"
                disabled={props.isSubmitting}
              >
                add stage
              </Button>
            </FormikForm.StyledForm>
            <Alert />
          </>
        )}
      </Formik>
    </FormikForm.StyledFormWrapper>
  );
};

export default AddStageBox;
