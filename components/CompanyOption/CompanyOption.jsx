import styles from "./CompanyOption.module.css";
import {useState} from "react";

export default function CompanyOption({text, setSelectedCompany}) {
  return (
    <label className={styles.option} onClick={() => setSelectedCompany(text)}>
      {text}
      <input name="companyOption" value={text} type="radio" />
    </label>
  );
}
