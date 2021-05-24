import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import { Box, Button, Typography } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import { ArrowForward } from '@material-ui/icons';
import { FormikForm, StyledAlert, ChooseAvatar } from '#components/shared';
import { AccountContext, UpdateUserAttributesType } from '#contexts';
import { useUser } from '#hooks';
import { getAttributesFromSession } from '#utils';
import { StyledButtonsWrapper, StyledCircularProgress } from './MainAttributesBox.style';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  avatarSrc: undefined,
  firstName: '',
  lastName: '',
  customFacebook: '',
  customLinkedin: '',
  customPhone: '',
  customJob: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Your first name is required.'),
  lastName: Yup.string().required('Your last name is required.'),
  customFacebook: Yup.string().url('Not recognized as an URL.'),
  customLinkedin: Yup.string().url('Not recognized as an URL.'),
  customPhone: Yup.string().matches(
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
    'Phone number not valid.',
  ),
  customJob: Yup.string(),
});

const MainAttributesBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const [avatarSrc, setAvatarSrc] = useState<string>();
  const [changesWereMade, setChangesWereMade] = useState(false);
  const { isSignedInWithAThirdParty } = useUser();
  const { deleteUser } = useContext(AccountContext.Context);

  const { getSession, updateUserAttributes, uploadAvatar } = useContext(AccountContext.Context);

  const onSubmit = async ({
    firstName,
    lastName,
    customFacebook,
    customLinkedin,
    customPhone,
    customJob,
  }: typeof initialValues) => {
    try {
      // if (changesWereMade) {
      const attributes: UpdateUserAttributesType = {
        'given_name': firstName,
        'family_name': lastName,
        'custom:custom_facebook': customFacebook ?? '',
        'custom:custom_linkedin': customLinkedin ?? '',
        'custom:custom_phone': customPhone ?? '',
        'custom:custom_job': customJob ?? '',
      };

      await updateUserAttributes(attributes);

      // Upload new avatar only if picture was changed
      if (getAttributesFromSession(await getSession()).picture !== avatarSrc)
        await uploadAvatar(avatarSrc!);
      // }

      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully updated profile.
        </StyledAlert>
      ));
      setTimeout(() => router.reload(), 500);
    } catch (e) {
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  const onClickDeleteAccount = async () => {
    try {
      await deleteUser();
      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully deleted profile.
        </StyledAlert>
      ));
      setTimeout(() => router.push('/'), 2000);
    } catch (e) {
      setAlert(() => () => (
        <StyledAlert severity="error" title="Error">
          {e.message}
        </StyledAlert>
      ));
    }
  };

  // load data
  useEffect(() => {
    getSession().then((userSession) => {
      const {
        picture,
        givenName,
        familyName,
        customFacebook,
        customLinkedin,
        customPhone,
        customJob,
      } = getAttributesFromSession(userSession);
      initialValues.firstName = givenName;
      initialValues.lastName = familyName;
      initialValues.customFacebook = customFacebook as string;
      initialValues.customLinkedin = customLinkedin as string;
      initialValues.customPhone = customPhone as string;
      initialValues.customJob = customJob as string;
      setAvatarSrc(picture);
    });
  }, []);

  // if data is not loaded yet
  if (
    isSignedInWithAThirdParty === undefined ||
    avatarSrc === undefined ||
    initialValues.firstName === ''
  )
    return <StyledCircularProgress />;

  return (
    <FormikForm.StyledFormWrapper>
      {isSignedInWithAThirdParty && (
        <MuiAlert severity="warning">
          You are logged in with a third party, you can&apos;t change your account information.
        </MuiAlert>
      )}

      <Box mt={2}>
        <Typography variant="h5" gutterBottom>
          Edit your profile
        </Typography>
      </Box>

      <Typography variant="body2" align="center" color="textSecondary">
        In this page you can change your profile information, if you want to change your email or
        password click the buttons at the bottom of this page.
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => {
          // useEffect(() => {
          //   getSession().then((userSession) => {
          //     const { picture, givenName, familyName } = getAttributesFromSession(userSession);
          //     let { customFacebook, customLinkedin, customPhone, customJob } =
          //       getAttributesFromSession(userSession);

          //     customFacebook = customFacebook ?? '';
          //     customLinkedin = customLinkedin ?? '';
          //     customPhone = customPhone ?? '';
          //     customJob = customJob ?? '';

          //     if (
          //       picture === avatarSrc &&
          //       props.values.firstName === givenName &&
          //       props.values.lastName === familyName &&
          //       props.values.customFacebook === customFacebook &&
          //       props.values.customLinkedin === customLinkedin &&
          //       props.values.customPhone === customPhone &&
          //       props.values.customJob === customJob
          //     )
          //       setChangesWereMade(false);
          //     else setChangesWereMade(true);
          //   });
          // }, [avatarSrc, props.values.firstName, props.values.lastName]);

          return (
            <>
              <FormikForm.StyledForm>
                <ChooseAvatar
                  disabled={isSignedInWithAThirdParty}
                  avatarSrc={avatarSrc}
                  setAvatarSrc={setAvatarSrc}
                  isCustomAvatarSet
                />
                <FormikForm.FormikField
                  disabled={isSignedInWithAThirdParty}
                  type="text"
                  name="firstName"
                  label="First name"
                  required
                />
                <FormikForm.FormikField
                  disabled={isSignedInWithAThirdParty}
                  type="text"
                  name="lastName"
                  label="Last name"
                  required
                />
                <FormikForm.FormikField
                  disabled={isSignedInWithAThirdParty}
                  type="text"
                  name="customJob"
                  label="Job"
                />
                <FormikForm.FormikField
                  disabled={isSignedInWithAThirdParty}
                  type="text"
                  name="customFacebook"
                  label="Link to Facebook"
                />
                <FormikForm.FormikField
                  disabled={isSignedInWithAThirdParty}
                  type="text"
                  name="customLinkedin"
                  label="Link to LinkedIn"
                />
                <FormikForm.FormikField
                  disabled={isSignedInWithAThirdParty}
                  type="text"
                  name="customPhone"
                  label="Phone number"
                />

                <Button
                  endIcon={<ArrowForward />}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSignedInWithAThirdParty || props.isSubmitting}
                >
                  save changes
                </Button>
              </FormikForm.StyledForm>
              <Alert />
            </>
          );
        }}
      </Formik>

      <StyledButtonsWrapper>
        <Link href="/profile/change-email">
          <Button disabled={isSignedInWithAThirdParty} variant="outlined" fullWidth>
            Change email
          </Button>
        </Link>

        <Link href="/profile/change-password">
          <Button disabled={isSignedInWithAThirdParty} variant="outlined" fullWidth>
            Change password
          </Button>
        </Link>

        <Box mt={2}>
          <Button
            disabled={isSignedInWithAThirdParty}
            color="secondary"
            variant="contained"
            fullWidth
            onClick={onClickDeleteAccount}
          >
            Delete account
          </Button>
        </Box>
      </StyledButtonsWrapper>
    </FormikForm.StyledFormWrapper>
  );
};

export default MainAttributesBox;
