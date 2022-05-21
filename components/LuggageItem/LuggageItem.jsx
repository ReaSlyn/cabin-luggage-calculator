import styles from "./LuggageItem.module.css";
import {useState} from "react";

export default function LuggageItem({item, weight, mode, onClickFunc}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.item}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClickFunc(item)}
    >
      <p className={styles.itemName}>{item}</p>
      {hovered ? (
        mode === "add" ? (
          <p className={styles.add}>Add &#8594;</p>
        ) : (
          <p className={styles.remove}>&#8592; Remove</p>
        )
      ) : (
        <p className={styles.weight}>{weight}g</p>
      )}
    </div>
  );
}
