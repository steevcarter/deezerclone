import styles from "./LoadingView.module.scss";

export const LoadingView = () => {
  return (
    <div className={styles.loadingWrapper}>
      <span className={styles.blob}></span>
      <span className={styles.blob}></span>
      <span className={styles.blob}></span>
    </div>
  );
};
