import * as Yup from 'yup';
import React, { SetStateAction, useContext, useEffect, useState } from 'react';
import { ErrorMessage, Formik, FormikProps, useField } from 'formik';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button, MenuItem, TextField, Typography } from '@material-ui/core';
import { ArrowForward, Image, Movie } from '@material-ui/icons';
import mime from 'mime-types';
import slugify from 'slugify';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FormikForm, StyledAlert, StyledButtonsWrapper, StyledDropzoneArea } from '#components/shared';
import { AccountContext } from '#contexts';
import { Stage } from '#types/stage';
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

interface SelectStageProps {
  stages: Stage[];
  setCurrentStage: React.Dispatch<SetStateAction<Stage | undefined>>;
}

const SelectStage: React.FunctionComponent<SelectStageProps> = ({ stages, setCurrentStage }) => {
  const [field, meta] = useField<Stage>('title');

  return (
    <TextField
      select
      variant="outlined"
      label="Stage title"
      error={meta.touched && meta.error ? true : false}
      helperText={<ErrorMessage name="title" />}
      {...field}
      onChange={(e) => {
        setCurrentStage(() => {
          const stageTitle = e.target.value;
          const _stage = stages.filter((stage) => stage.title === stageTitle)[0]!;
          initialValues.title = _stage.title;
          initialValues.subheader = _stage.subheader;
          initialValues.body = _stage.body;
          initialValues.externalLink = _stage.externalLink;
          return _stage;
        });
        field.onChange(e);
      }}
    >
      {stages.map((stage) => (
        <MenuItem key={stage.title} value={stage.title}>
          {stage.title}
        </MenuItem>
      ))}
    </TextField>
  );
};

const EditStageBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const [imageFile, setImageFile] = useState<File>();
  const [videoFile, setVideoFile] = useState<File>();
  const [s3Client, setS3Client] = useState<S3Client>();
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStage, setCurrentStage] = useState<Stage>();
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
        console.error('🚀  -> file: EditStageBox.tsx  -> line 58  -> e', e);
      }
    };

    const fetchStages = async () => {
      const response = await axios.get(ENDPOINTS.STAGES, {
        headers: { Authorization: `Bearer ${(await getSession()).getIdToken().getJwtToken()}` },
      });
      setStages(response.data.data.items);
      setCurrentStage(() => {
        const _stage = response.data.data.items[0] as Stage;
        initialValues.title = _stage.title;
        initialValues.subheader = _stage.subheader;
        initialValues.body = _stage.body;
        initialValues.externalLink = _stage.externalLink;
        return _stage;
      });
    };

    setupClient();
    fetchStages();
  }, []);

  const onSubmit = async ({ title, subheader, body, externalLink }: typeof initialValues) => {
    try {
      const SK = slugify(currentStage!.title, { lower: true });

      let imageFileKey;
      if (imageFile) {
        // user has selected an image
        imageFileKey = `${SK}/image.${mime.extension(imageFile.type)}`;
        // upload image file
        await s3Client!.send(
          new PutObjectCommand({
            Bucket: S3_STAGES_BUCKET_NAME,
            Key: imageFileKey,
            Body: imageFile,
          }),
        );
      } else {
        imageFileKey = currentStage!.imageLink.slice(currentStage!.imageLink.indexOf(SK));
      }

      let videoFileKey;
      if (videoFile) {
        // user has selected a video
        videoFileKey = `${SK}/video.${mime.extension(videoFile.type)}`;
        // upload video file
        await s3Client!.send(
          new PutObjectCommand({
            Bucket: S3_STAGES_BUCKET_NAME,
            Key: videoFileKey,
            Body: videoFile,
          }),
        );
      } else {
        videoFileKey = currentStage!.videoLink.slice(currentStage!.videoLink.indexOf(SK));
      }

      // edit stage
      await axios.put(
        `${ENDPOINTS.STAGES}/${SK}`,
        {
          title: currentStage!.title,
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
          Successfully edited the&nbsp;
          {currentStage!.title}
          &nbsp;stage.
        </StyledAlert>
      ));
      setTimeout(() => router.reload(), 2000);
    } catch (e) {
      console.dir('🚀  -> file: EditStagesBox.tsx  -> line 177  -> e', e);
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

  const onClickDeleteStage = async () => {
    try {
      const SK = slugify(currentStage!.title, { lower: true });
      await axios.delete(`${ENDPOINTS.STAGES}/${SK}`, {
        headers: { Authorization: `Bearer ${(await getSession()).getIdToken().getJwtToken()}` },
      });
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully deleted the&nbsp;
          {currentStage!.title}
          &nbsp;stage.
        </StyledAlert>
      ));
      setTimeout(() => router.reload(), 2000);
    } catch (e) {
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
        Edit a stage
      </Typography>
      <Typography variant="body2" align="center" color="textSecondary">
        The edited stage will be available on the main page, allowing users to interact with it.
      </Typography>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => (
          <>
            <FormikForm.StyledForm>
              <SelectStage stages={stages} setCurrentStage={setCurrentStage} />
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
                edit stage
              </Button>
            </FormikForm.StyledForm>
            <Alert />
          </>
        )}
      </Formik>

      <StyledButtonsWrapper>
        <Button color="secondary" variant="contained" fullWidth onClick={onClickDeleteStage}>
          Delete stage
        </Button>
      </StyledButtonsWrapper>
    </FormikForm.StyledFormWrapper>
  );
};

export default EditStageBox;
