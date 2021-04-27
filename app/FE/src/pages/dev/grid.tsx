/* eslint-disable */
import { Grid } from '@material-ui/core';
import Link from 'next/link';

const Page = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6} style={{ backgroundColor: 'red' }}>
        <div>haha</div>
      </Grid>
      <Grid item xs={4} style={{ backgroundColor: 'green' }}>
        <div>haha</div>
      </Grid>
      <Grid item xs={2} style={{ backgroundColor: 'purple' }}>
        <div>haha</div>
      </Grid>
      <Grid item xs={4} style={{ backgroundColor: 'purple' }}>
        <div>haha</div>
      </Grid>
      <Grid item xs={8} style={{ backgroundColor: 'purple' }}>
        <div>haha</div>
        <Link href="/about">
          <a>About</a>
        </Link>
      </Grid>
    </Grid>
  );
};

export default Page;
