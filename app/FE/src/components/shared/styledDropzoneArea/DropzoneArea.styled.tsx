import styled from 'styled-components';
import { DropzoneArea } from 'material-ui-dropzone';

const StyledDropzoneArea = styled((props) => (
  <DropzoneArea
    useChipsForPreview
    showAlerts={['error', 'info']}
    previewGridProps={{ container: { justify: 'center' } }}
    dropzoneClass={props.className}
    {...props}
  />
))`
  min-height: 200px;
  margin: ${({ theme }) => theme.spacing(0.75)}px 0;
`;

export default StyledDropzoneArea;
