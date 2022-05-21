import Head from "next/head";
import styles from "../styles/Report.module.css";
import axios from "axios";
import {useRouter} from "next/router";
import {useState, useEffect} from "react";
import ReportItem from "../components/ReportItem/ReportItem";

export async function getStaticProps() {
  const luggage = await axios.get(
    "https://the-offline-back.herokuapp.com/api/v2/cabin-luggage-inventory"
  );

  return {
    props: {
      luggage: luggage.data || {},
    },
  };
}

export default function Home({luggage}) {
  const router = useRouter();
  const {selectedItems, totalWeight, selectedCompany, maxWeight} = router.query;
  const [selectedInventory, setSelectedInventory] = useState([]);

  useEffect(() => {
    if (selectedItems) {
      selectedItems.split("&").forEach((item) => {
        setSelectedInventory((prevState) => [...prevState, item]);
      });
    }
  }, [selectedItems]);

  const itemWeight = (item) => {
    let [itemObject] = luggage.items.filter((luggageItem) => {
      return luggageItem.label === item;
    });
    return itemObject.weight;
  };

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
            {selectedInventory.map((item) => (
              <ReportItem key={item} item={item} weight={itemWeight(item)} />
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
