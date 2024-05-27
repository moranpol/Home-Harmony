import React, { useState } from "react";
import BulletinPaper from "./BulletinPaper";

const initialBulletins = [
    { id: 1, userName: "John Doe", info: "Meeting at 3 PM", date: new Date() },
    { id: 2, userName: "Jane Smith", info: "Party on Friday", date: new Date() },
  ];

function HomePage({ userId }: { userId: number }) {
  const [bulletins, setBulletins] = useState(initialBulletins);

  const handleDelete = (id: number) => {
    //todo: delete bulletin with id
  };

  return (
    <div style={{ margin: "10px" }}>
      {bulletins.map(bulletin => (
        <BulletinPaper
          key={bulletin.id}
          id={bulletin.id}
          userName={bulletin.userName}
          info={bulletin.info}
          date={bulletin.date}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default HomePage;
