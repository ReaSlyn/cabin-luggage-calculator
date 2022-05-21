import Head from "next/head";
import styles from "../styles/Home.module.css";
import {useState, useEffect} from "react";
import axios from "axios";
import CompanyOption from "../components/CompanyOption/CompanyOption";
import LuggageItem from "../components/LuggageItem/LuggageItem";
import {useRouter} from "next/router";

function decryptKey(key) {
  let decryptedKey = "";
  for (let i = 0; i < key.length; i++) {
    decryptedKey += String.fromCharCode(key[i].charCodeAt(0) - 3);
  }
  return decryptedKey;
}

export async function getStaticProps() {
  const carrier = await axios.get(
    `https://the-offline-bp-back.herokuapp.com/get-carriers?secret_key=${decryptKey(
      "SlfduglhSdvKdxwvGhIudqfh"
    )}`
  );
  const luggage = await axios.get(
    "https://the-offline-back.herokuapp.com/api/v2/cabin-luggage-inventory"
  );

  return {
    props: {
      carrier: carrier.data || {},
      luggage: luggage.data || {},
    },
  };
}

export default function Home({carrier, luggage}) {
  const [selectorIsOpen, setSelectorIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [maxWeight, setMaxWeight] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalWeight, setTotalWeight] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (selectedCompany === "") {
      return setMaxWeight(0);
    }

    let [company] = carrier.message.filter((company) => {
      if (company.label === selectedCompany) {
        return company.limit;
      }
    });
    setMaxWeight(company.limit);
  }, [selectedCompany]);

  useEffect(() => {
    setInventory(luggage.items);
  }, [luggage]);

  useEffect(() => {
    let weight = 0;
    let items = "";
    selectedInventory.forEach((selectedItem) => {
      weight += selectedItem.weight;
      items += selectedItem.label + "&";
    });
    items = items.substring(0, items.length - 1);

    setTotalWeight(weight);
    setSelectedItems(items);
  }, [selectedInventory]);

  return (
    <>
      <Head>
        <title>Cabin luggage calculator</title>
        <meta name="description" content="Cabin luggage calculator" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <div className={styles.selectorContainer}>
          <div
            className={styles.selector}
            onClick={() => setSelectorIsOpen((bool) => !bool)}
          >
            <p>Airlines</p>
            <div className={styles.selectorArrow}>
              <span
                className={
                  selectorIsOpen
                    ? `${styles.left} ${styles.active}`
                    : styles.left
                }
              ></span>
              <span
                className={
                  selectorIsOpen
                    ? `${styles.right} ${styles.active}`
                    : styles.right
                }
              ></span>
            </div>
          </div>
          <div
            className={
              selectorIsOpen
                ? `${styles.active} ${styles.overlay}`
                : styles.overlay
            }
          >
            {carrier.message.map((carrier) => (
              <CompanyOption
                key={carrier.label}
                text={carrier.label}
                setSelectedCompany={setSelectedCompany}
              />
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.card}>
            <h2>Inventory</h2>
            <hr />
            <div className={styles.itemList}>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <LuggageItem
                    key={item.label}
                    item={item.label}
                    weight={item.weight}
                    mode="add"
                    onClickFunc={(item) => {
                      setSelectedInventory((all) => {
                        let [targetItem] = inventory.filter(
                          (i) => i.label === item
                        );
                        return [...all, targetItem];
                      });
                      setInventory((inventory) => {
                        return inventory.filter((inventoryItem) => {
                          return inventoryItem.label !== item;
                        });
                      });
                    }}
                  />
                ))
              ) : (
                <p>No item available...</p>
              )}
            </div>
          </div>
          <img src="svg/arrow.svg" alt="arrow" />
          <div className={styles.card}>
            <h2>Selected</h2>
            <hr />
            <div
              className={styles.itemList}
              style={selectedInventory.length === 0 ? {height: "328px"} : null}
            >
              {selectedInventory.length > 0
                ? selectedInventory.map((item) => (
                    <LuggageItem
                      key={`selected ${item.label}`}
                      item={item.label}
                      weight={item.weight}
                      mode="remove"
                      onClickFunc={(item) => {
                        setInventory((all) => {
                          let [targetItem] = selectedInventory.filter(
                            (i) => i.label === item
                          );
                          return [...all, targetItem];
                        });
                        setSelectedInventory((inventory) => {
                          return inventory.filter((inventoryItem) => {
                            return inventoryItem.label !== item;
                          });
                        });
                      }}
                    />
                  ))
                : null}
            </div>
            <hr />
            <div className={styles.totalWrapper}>
              <div className={styles.total}>
                <p>Total</p>
                <p
                  className={totalWeight > maxWeight ? styles.overweight : null}
                >
                  {totalWeight >= 1000
                    ? `${totalWeight / 1000}kg`
                    : `${totalWeight}g`}
                </p>
              </div>
              <div className={styles.total}>
                <p>Max</p>
                <p
                  className={totalWeight > maxWeight ? styles.overweight : null}
                >
                  {maxWeight >= 1000
                    ? `${maxWeight / 1000}kg`
                    : `${maxWeight}g`}
                </p>
              </div>
            </div>
            <hr />
            <div
              className={
                totalWeight > maxWeight || totalWeight === 0
                  ? `${styles.button}`
                  : `${styles.button} ${styles.active}`
              }
              onClick={() => {
                totalWeight > maxWeight || totalWeight === 0
                  ? null
                  : router.push({
                      pathname: "/report",
                      query: {
                        selectedItems,
                        totalWeight,
                        selectedCompany,
                        maxWeight,
                      },
                    });
              }}
            >
              <p>See resume</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
