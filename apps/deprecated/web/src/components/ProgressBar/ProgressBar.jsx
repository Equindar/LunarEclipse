import classes from './ProgressBar.module.css';

const ProgressBar = (props) => {
  const value = 100 - props.amount + '%';

  return (
    <>
      <div className={classes.progressbar}>
        <div className={classes.progressbar__inner}>
          <div className={classes.progressbar__fill} style={{ width: value }}></div>
        </div>
        <div className={classes.progressbar__label}>{props.label}</div>
      </div>
    </>
  );
};

export default ProgressBar;
