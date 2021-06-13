import Link from 'next/link';
import { Button, Typography } from '@material-ui/core';
import { FormikForm, StyledButtonsWrapper } from '#components/shared';

const MenuBox = () => (
  <FormikForm.StyledFormWrapper>
    <Typography variant="h5" gutterBottom>
      Edit stages
    </Typography>

    <Typography variant="body2" align="center" color="textSecondary" gutterBottom>
      In this page you can edit information about stages or add a new one.
    </Typography>

    <StyledButtonsWrapper>
      <Link href="/stages/add">
        <Button variant="outlined" fullWidth>
          add stage
        </Button>
      </Link>

      <Link href="/stages/edit">
        <Button variant="outlined" fullWidth>
          edit stage
        </Button>
      </Link>
    </StyledButtonsWrapper>
  </FormikForm.StyledFormWrapper>
);

export default MenuBox;
