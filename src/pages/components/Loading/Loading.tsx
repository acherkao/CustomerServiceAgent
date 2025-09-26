import React from 'react';
import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loader__container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Loading;
