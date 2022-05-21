import styles from "./ReportItem.module.css";

export default function ReportItem({item, weight}) {
  return (
    <div className={styles.item}>
      <p className={styles.itemName}>{item}</p>
      <p className={styles.weight}>{weight}g</p>
    </div>
  );
}
