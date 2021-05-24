import { ListItem, ListItemIcon, ListItemText, Link } from '@material-ui/core';
import { LinkedIn, Facebook, Email, Phone } from '@material-ui/icons';
import React from 'react';

type ListItemType = 'linkedin' | 'facebook' | 'email' | 'phone';

const typeToIconMap = new Map<string, React.ReactElement>();
typeToIconMap.set('linkedin', <LinkedIn fontSize="large" />);
typeToIconMap.set('facebook', <Facebook fontSize="large" />);
typeToIconMap.set('email', <Email fontSize="large" />);
typeToIconMap.set('phone', <Phone fontSize="large" />);

interface ComputeListItemText {
  (type: ListItemType, data: string): React.ReactElement;
}

const computeListItemText: ComputeListItemText = (type, data) => {
  if (['linkedin', 'facebook'].includes(type))
    return (
      <Link href={data} target="_blank" rel="noopener">
        {data}
      </Link>
    );
  if (['email'].includes(type)) return <Link href={`mailto:${data}`}>{data}</Link>;
  if (['phone'].includes(type)) return <Link href={`tel:${data}`}>{data}</Link>;

  return <>{data}</>;
};

interface ContactListItemProps {
  type: ListItemType;
  data: string;
}

const ContactListItem: React.FunctionComponent<ContactListItemProps> = ({ type, data }) => (
  <ListItem>
    <ListItemIcon>{typeToIconMap.get(type)}</ListItemIcon>
    <ListItemText>{computeListItemText(type, data)}</ListItemText>
  </ListItem>
);

export default ContactListItem;
