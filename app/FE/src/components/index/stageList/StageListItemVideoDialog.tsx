import React from 'react';
import { StyledVideo } from './StageListItemVideoDialog.style';

interface StageListItemVideoDialogProps {
  videoLink: string;
}

const StageListItemVideoDialog: React.FunctionComponent<StageListItemVideoDialogProps> = ({ videoLink }) => (
  <StyledVideo src={videoLink} controls />
);

export default StageListItemVideoDialog;
