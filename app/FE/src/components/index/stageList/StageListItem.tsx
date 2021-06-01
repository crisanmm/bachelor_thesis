import React, { SetStateAction } from 'react';
import { CardActions, IconButton, Button, Link, Typography } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import { StyledCard, StyledCardHeader, StyledCardMedia, StyledCardContent } from './StageListItem.style';

interface StageListItemProps {
  title: string;
  subheader: string;
  externalLink: string;
  imageLink: string;
  body: string;
  setStageId: (stageId: string) => void;
}

const StageListItem: React.FunctionComponent<StageListItemProps> = ({
  title,
  subheader,
  externalLink,
  imageLink,
  body,
  setStageId,
}) => (
  <StyledCard>
    <StyledCardHeader
      title={title}
      subheader={subheader}
      action={
        <Link href={externalLink} rel="noreferrer">
          <IconButton>
            <Launch />
          </IconButton>
        </Link>
      }
    />
    <StyledCardMedia image={imageLink} title={`${title}'s logo`} />
    <StyledCardContent>
      <Typography variant="body2" color="textSecondary">
        {body}
      </Typography>
    </StyledCardContent>
    <CardActions>
      <Button color="primary" variant="text" onClick={() => setStageId(title.toLowerCase())}>
        join stage
      </Button>
    </CardActions>
  </StyledCard>
);

export default StageListItem;
