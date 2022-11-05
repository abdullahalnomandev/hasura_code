import Head from "next/head";
import React from "react";

const index = (props) => {

  const allProducts = props.products.products;
  console.log(allProducts);
  return (
    <div>
      <Head>
        <title>Getting Started with Next.js</title>
      </Head>
      <h1>Product</h1>
      {allProducts?.map(({name,price}, i) => (
        <div  key={i}>
          <h1>{name}</h1>
          <p>{price}</p>
          <button className=" btn btn-success px-3 py-2">Details </button>
        </div>
      ))}
     
    </div>
  );
};

export default index;

export const getStaticProps = async (context) => {
  const options = {
    method: "POST",
    headers: {
      "x-hasura-admin-secret":
        "pZg65ZTrvsBXkLUz9QoZDfiswwm74eZgFayLj5g3mk73Y9S1T6zQ84j1nliJ4GNX",
    },
    body: JSON.stringify({
      query: `
      query fetchProducts{
        products{
          id
          name
          price
        }
      }
      `,
      operationName: "fetchProducts",
    }),
  };
  const fetchResponse = await fetch(
    "https://nextjs-hasura-12.hasura.app/v1/graphql",
    options
  );
  const responseJson = await fetchResponse.json();
  const products = responseJson.data;

  return {
    props: { products: products },
  };
};
