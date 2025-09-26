import React from 'react';

interface TranscriptMessage {
  type: string;
  message: string;
}

interface TranscriptProps {
  transcript: TranscriptMessage[];
}

const ContactHistoryTranscript: React.FC<TranscriptProps> = ({ transcript }) => {
  return (
    <div>
      {transcript.map((entry, index) => (
        <div key={index} className={entry.type === "Agent" ? "agent" : "customer"}>
          <b>{entry.type}:</b> {entry.message}
          <br />
        </div>
      ))}
    </div>
  );
};

export default ContactHistoryTranscript;
