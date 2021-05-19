import * as Yup from 'yup';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState, useEffect } from 'react';
import { Formik, FormikProps } from 'formik';
import { Box, Button, Typography } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import { ArrowForward } from '@material-ui/icons';
import { FormikForm, StyledAlert, ChooseAvatar } from '#components/shared';
import { AccountContext } from '#contexts';
import { StyledButtonsWrapper, StyledCircularProgress } from './MainAttributesBox.style';
import { useUser } from '#hooks';

/**
 * Used for giving initial values to {@link https://formik.org/ | formik}.
 */
const initialValues = {
  avatarSrc: undefined,
  firstName: '',
  lastName: '',
};

/**
 * {@link https://www.npmjs.com/package/yup | yup} validation schema
 * passed to {@link https://formik.org/ | formik}.
 */
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Your first name is required.'),
  lastName: Yup.string().required('Your last name is required.'),
});

const MainAttributesBox = () => {
  const router = useRouter();
  const [Alert, setAlert] = useState<React.ComponentType>(() => () => <></>);
  const [avatarSrc, setAvatarSrc] = useState<string>();
  const [changesWereMade, setChangesWereMade] = useState(false);
  const [isUserDeleted, setIsUserDeleted] = useState(false);
  const { isSignedInWithAThirdParty } = useUser();
  const { deleteUser } = useContext(AccountContext.Context);

  const { getSession, updateUserAttributes, uploadAvatar } = useContext(AccountContext.Context);

  const onSubmit = async ({ firstName, lastName }: typeof initialValues) => {
    try {
      if (changesWereMade) {
        await updateUserAttributes({ given_name: firstName, family_name: lastName });

        // Upload new avatar only if picture was changed
        if ((await getSession()).getIdToken().payload.picture !== avatarSrc)
          await uploadAvatar(avatarSrc!);
      }

      setAlert(() => () => (
        <StyledAlert severity="success" title="Success">
          Successfully updated profile.
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

  useEffect(() => {
    getSession().then((userSession) => {
      const {
        given_name: givenName,
        family_name: familyName,
        picture,
      } = userSession.getIdToken().payload;
      initialValues.firstName = givenName;
      initialValues.lastName = familyName;
      setAvatarSrc(picture);
    });
  }, []);

  // // if data is not loaded yet
  // if (
  //   isSignedInWithAThirdParty === undefined ||
  //   avatarSrc === undefined ||
  //   initialValues.firstName === '' ||
  //   initialValues.lastName === ''
  // )
  //   return <StyledCircularProgress />;

  return (
    <FormikForm.StyledFormWrapper>
      {isSignedInWithAThirdParty ? (
        <MuiAlert severity="warning">
          You are logged in with a third party, you can&apos;t change your account information.
        </MuiAlert>
      ) : undefined}

      <Box mt={2}>
        <Typography variant="h5" gutterBottom>
          Edit your profile
        </Typography>
      </Box>

      <Typography variant="body2" align="center" color="textSecondary">
        In this page you can change your first and last name, if you want to change your email or
        password click the buttons at the bottom of this page.
      </Typography>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {(props): { props: FormikProps<typeof initialValues> } => {
          useEffect(() => {
            getSession().then((userSession) => {
              const {
                given_name: givenName,
                family_name: familyName,
                picture,
              } = userSession.getIdToken().payload;

              if (
                picture === avatarSrc &&
                props.values.firstName === givenName &&
                props.values.lastName === familyName
              )
                setChangesWereMade(false);
              else setChangesWereMade(true);
            });
          }, [avatarSrc, props.values.firstName, props.values.lastName]);

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

                <Button
                  endIcon={<ArrowForward />}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSignedInWithAThirdParty || props.isSubmitting || !changesWereMade}
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
            onClick={async () => {
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
            }}
          >
            Delete account
          </Button>
        </Box>
      </StyledButtonsWrapper>
    </FormikForm.StyledFormWrapper>
  );
};

export default MainAttributesBox;
