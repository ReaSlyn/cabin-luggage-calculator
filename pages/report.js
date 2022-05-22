import Head from "next/head";
import styles from "../styles/Report.module.css";
import {useRouter} from "next/router";
import {useState, useEffect} from "react";
import ReportItem from "../components/ReportItem/ReportItem";

export default function Home() {
  const router = useRouter();
  const {
    selectedItems,
    selectedItemWeight,
    totalWeight,
    selectedCompany,
    maxWeight,
  } = router.query;
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [selectedInventoryWeight, setSelectedInventoryWeight] = useState([]);

  /* Split the string by `&` from the query params to get the items and their weight and push them into an array*/
  useEffect(() => {
    if (selectedItems) {
      selectedItems.split("&").forEach((item) => {
        setSelectedInventory((prevState) => [...prevState, item]);
      });

      selectedItemWeight.split("&").forEach((itemWeight) => {
        setSelectedInventoryWeight((prevState) => [...prevState, itemWeight]);
      });
    }
  }, [selectedItems]);

  return (
    <>
      <Head>
        <title>Cabin luggage calculator - Resume</title>
        <meta name="description" content="Cabin luggage calculator - Resume" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <div className={styles.company}>
          <p>{selectedCompany}</p>
        </div>
        <div className={styles.card}>
          <h2>My backpack</h2>
          <hr />
          <div className={styles.itemList}>
            {selectedInventory.map((item, index) => (
              <ReportItem
                key={item}
                item={item}
                weight={selectedInventoryWeight[index]}
              />
            ))}
          </div>
          <hr />
          <div className={styles.totalWrapper}>
            <div className={styles.total}>
              <p>Total</p>
              <p>
                {totalWeight >= 1000
                  ? `${totalWeight / 1000}kg`
                  : `${totalWeight}g`}
              </p>
            </div>
            <div className={styles.total}>
              <p>Max</p>
              <p>
                {maxWeight >= 1000 ? `${maxWeight / 1000}kg` : `${maxWeight}g`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
