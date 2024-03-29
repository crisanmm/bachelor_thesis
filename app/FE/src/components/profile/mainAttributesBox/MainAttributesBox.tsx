import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { ErrorMessage, Formik, FormikProps, useField } from 'formik';
import { Box, Button, MenuItem, TextField, Typography } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import { ArrowForward } from '@material-ui/icons';
import {
  FormikForm,
  StyledAlert,
  ChooseAvatar,
  StyledCircularProgress,
  StyledButtonsWrapper,
} from '#components/shared';
import { AccountContext, UpdateUserAttributesType } from '#contexts';
import { useUser } from '#hooks';
import { getAttributesFromSession } from '#utils';
import languages from './languages.json';

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
  customLanguage: '',
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
  customLanguage: Yup.string().oneOf(languages.map((language) => language.name)),
});

interface GetLanguageCode {
  (languageName: string): string | undefined;
}

/**
 * Get the language code of corresponding language name.
 * @param languageName Name of the language from languages.json
 * @returns Code of the language from languages.json
 */
const getLanguageCode: GetLanguageCode = (languageName) => {
  const languageObject = languages.find((language) => language.name === languageName);
  return languageObject?.code;
};

interface GetLanguageName {
  (languageCode: string | undefined): string | undefined;
}
/**
 * Get the language name of corresponding language code.
 * @param languageCode Code of the language from languages.json
 * @returns Name of the language from languages.json
 */
const getLanguageName: GetLanguageName = (languageCode) => {
  if (languageCode === undefined) return '';
  const languageObject = languages.find((language) => language.code === languageCode);
  return languageObject?.name;
};

const SelectLanguage = () => {
  const [field, meta] = useField('customLanguage');

  return (
    <TextField
      select
      variant="outlined"
      label="Language"
      error={meta.touched && meta.error ? true : false}
      helperText={<ErrorMessage name="customLanguage" />}
      {...field}
    >
      {languages.map((language) => (
        <MenuItem key={language.code} value={language.name}>
          {language.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

const MainAttributesBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const [avatarSrc, setAvatarSrc] = useState<string>();
  const { isSignedInWithAThirdParty, isAdmin } = useUser();
  const { deleteUser, getSession, updateUserAttributes, adminUpdateUserAttributes, uploadAvatarToken } = useContext(
    AccountContext.Context,
  );

  const onSubmit = async ({
    firstName,
    lastName,
    customFacebook,
    customLinkedin,
    customPhone,
    customJob,
    customLanguage,
  }: typeof initialValues) => {
    try {
      // if (changesWereMade) {
      // Upload new avatar only if picture was changed
      if (getAttributesFromSession(await getSession()).picture !== avatarSrc) await uploadAvatarToken(avatarSrc!);

      const attributes: UpdateUserAttributesType = {
        'custom:custom_facebook': customFacebook ?? '',
        'custom:custom_linkedin': customLinkedin ?? '',
        'custom:custom_phone': customPhone ?? '',
        'custom:custom_job': customJob ?? '',
        'custom:custom_language': getLanguageCode(customLanguage) ?? '',
      };

      if (!isSignedInWithAThirdParty) {
        attributes.given_name = firstName;
        attributes.family_name = lastName;

        await updateUserAttributes(attributes);
        setAlert(() => () => (
          <StyledAlert severity="success" title="Success">
            Successfully updated profile.
          </StyledAlert>
        ));
        setTimeout(() => router.reload(), 500);
      } else {
        // if signed in with third party, call a HTTP triggered lambda function that
        // changes the custom attributes
        await adminUpdateUserAttributes(attributes);
        setAlert(() => () => (
          <StyledAlert severity="success" title="Success">
            Successfully updated profile. Please log out and log in again for the changes to show.
          </StyledAlert>
        ));
        setTimeout(() => router.reload(), 2000);
      }
      // }
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
      const { picture, givenName, familyName, customFacebook, customLinkedin, customPhone, customJob, customLanguage } =
        getAttributesFromSession(userSession);
      initialValues.firstName = givenName;
      initialValues.lastName = familyName;
      initialValues.customFacebook = customFacebook ?? '';
      initialValues.customLinkedin = customLinkedin ?? '';
      initialValues.customPhone = customPhone ?? '';
      initialValues.customJob = customJob ?? '';
      initialValues.customLanguage = getLanguageName(customLanguage) ?? '';
      setAvatarSrc(picture);
    });
  }, []);

  // if data is not loaded yet
  if (isSignedInWithAThirdParty === undefined || avatarSrc === undefined || initialValues.firstName === '')
    return <StyledCircularProgress />;

  return (
    <FormikForm.StyledFormWrapper>
      {isSignedInWithAThirdParty && (
        <MuiAlert severity="info">
          You are logged in with a third party, you can&apos;t change some of your account information.
        </MuiAlert>
      )}

      <Box mt={2}>
        <Typography variant="h5" gutterBottom>
          Edit your profile
        </Typography>
      </Box>

      <Typography variant="body2" align="center" color="textSecondary">
        In this page you can change your profile information, if you want to change your email or password click the
        buttons at the bottom of this page.
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => (
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
              <FormikForm.FormikField type="text" name="customJob" label="Job" />
              <FormikForm.FormikField type="text" name="customFacebook" label="Link to Facebook" />
              <FormikForm.FormikField type="text" name="customLinkedin" label="Link to LinkedIn" />
              <FormikForm.FormikField type="text" name="customPhone" label="Phone number" />

              <SelectLanguage />

              <Button
                endIcon={<ArrowForward />}
                variant="contained"
                color="primary"
                type="submit"
                disabled={props.isSubmitting}
              >
                save changes
              </Button>
            </FormikForm.StyledForm>
            <Alert />
          </>
        )}
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

        {isAdmin && (
          <Link href="/stages">
            <Button disabled={!isAdmin} variant="outlined" fullWidth>
              Change stages
            </Button>
          </Link>
        )}

        <Box mt={2}>
          <Button color="secondary" variant="contained" fullWidth onClick={onClickDeleteAccount}>
            Delete account
          </Button>
        </Box>
      </StyledButtonsWrapper>
    </FormikForm.StyledFormWrapper>
  );
};

export default MainAttributesBox;
