import React, { useState } from 'react';
import { CardActions, IconButton, Button, Link, Typography, Dialog } from '@material-ui/core';
import { Launch } from '@material-ui/icons';
import type { Stage as StageType } from '#types/stage';
import { StyledCard, StyledCardHeader, StyledCardMedia, StyledCardContent } from './StageListItem.style';
import StageListItemVideoDialog from './StageListItemVideoDialog';

interface StageListItemProps extends StageType {
  setStage: (stage: StageType) => void;
}

const StageListItem: React.FunctionComponent<StageListItemProps> = ({ setStage, ...stage }) => {
  const { title, subheader, externalLink, imageLink, videoLink, body } = stage;
  const [isViewVideoButtonClicked, setIsViewVideoButtonClicked] = useState<boolean>(false);

  const onClickJoinStage = () => {
    setStage(stage);
  };

  const onClickViewVideoButton = () => {
    setIsViewVideoButtonClicked((isViewVideoButtonClicked) => !isViewVideoButtonClicked);
  };

  return (
    <>
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
          <Button color="primary" variant="text" onClick={onClickJoinStage}>
            join stage
          </Button>
          <Button color="primary" onClick={onClickViewVideoButton}>
            view video
          </Button>
        </CardActions>
      </StyledCard>
      <Dialog open={isViewVideoButtonClicked} onClose={onClickViewVideoButton}>
        <StageListItemVideoDialog videoLink={videoLink} />
      </Dialog>
    </>
  );
};

export default StageListItem;
