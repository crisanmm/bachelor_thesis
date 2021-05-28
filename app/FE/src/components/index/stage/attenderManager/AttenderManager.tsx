import React, { useState, useContext, useEffect } from 'react';
import { SocketContext, AccountContext } from '#contexts';
import { getAttributesFromSession } from '#utils';
import Attender from './attender';
import { AttenderType } from './shared';

type AttendersType = Array<AttenderType>;

const AttenderManager = () => {
  const { getSession } = useContext(AccountContext.Context);
  const socket = useContext(SocketContext.Context).stageSocket!;
  const { emitter } = useContext(SocketContext.Context);
  const [myAttender, setMyAttender] = useState<AttenderType>({} as AttenderType);
  const [attenders, setAttenders] = useState<AttendersType>([]);

  useEffect(() => {
    emitter.on('my-attender-position-change', (position) => {
      /**
       *  This event is emitted client-side when the attender
       *  (the attender from the user's perspective) wants to change its position.
       */
      setMyAttender((myAttender) => {
        myAttender.position = position;
        socket.emit('attender-position-change', { id: myAttender.id, position });
        return { ...myAttender };
      });
    });

    socket.on('attender-join', (attender: AttenderType) => {
      setAttenders((attenders) => [...attenders, attender]);
    });

    socket.on('attender-leave', (attender: AttenderType) => {
      setAttenders((attenders) => [...attenders.filter((a) => a.id !== attender.id)]);
    });

    socket.on('attender-position-change', ({ id, position }) => {
      /**
       *  This event is emitted by the server when an attender changes its position
       */
      setAttenders((attenders) => {
        const attender = attenders.find((attender) => attender.id === id) as AttenderType;
        attender.position = position;
        return [...attenders];
      });
    });

    getSession()
      .then((userSession) => {
        const attributes = getAttributesFromSession(userSession);

        const attender: AttenderType = {
          position: [0, 0, 0],
          ...attributes,
        };
        setMyAttender(attender);
        socket.emit('attender-join');
      })
      .catch();
  }, []);

  return (
    <>
      {Object.keys(myAttender).length === 0 ? undefined : (
        <Attender key={myAttender.id} {...myAttender} size="lg" color="green" isMyAttender />
      )}
      {attenders.map((attender) => (
        <Attender key={attender.id} {...attender} size="md" color="white" />
      ))}
    </>
  );
};

export default AttenderManager;
