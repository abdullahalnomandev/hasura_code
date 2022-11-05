import Head from "next/head";
import React from "react";
import { Card, Button } from "react-bootstrap";

const index = (props) => {
  const allProducts = props.products.products;
  return (
    <>
      <Head>
        <title>Getting Started with Next.js</title>
      </Head>

      <div className="container ">
      <h1>Getting Started with E-commerce Website</h1>
        <div className="row">
        {allProducts?.map(({ name, price,id,image_path}) => (
        <Card style={{ width: "18rem" }} key={id} className='col-md-3 col-sm-4 mx-3 my-2'>
          <Card.Img variant="top" src={image_path} />
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Text>
              Price: {price}
            </Card.Text>
            <div className="d-flex justify-content-center align-items-center gap-2">
            <Button variant="success">Delete</Button>
            <Button variant="danger">Update</Button>
            </div>
          </Card.Body>
        </Card>
      ))}
        </div>
      </div>
    </>
  );
};

export default index;

export const getStaticProps = async (context) => {
  const options = {
    method: "POST",
    headers: {
      "x-hasura-admin-secret":process.env.NEXT_HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: `
      query fetchProducts{
        products{
          id
          name
          image_path
          price
        }
      } 
      `,
      operationName: "fetchProducts",
    }),
  };
  const fetchResponse = await fetch(process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT,
    options
  );
  const responseJson = await fetchResponse.json();
  const products = responseJson.data;

  return {
    props: { products: products },
  };
};
