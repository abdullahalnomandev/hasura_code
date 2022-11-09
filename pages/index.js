import Head from "next/head";
import React from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import { useForm } from "react-hook-form";

const Index = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    console.log("data", data);
    const endpoint = "https://nextjs-hasura-12.hasura.app/v1/graphql";
    const headers = {
      "content-type": "application/json",
      "x-hasura-admin-secret":
        "pZg65ZTrvsBXkLUz9QoZDfiswwm74eZgFayLj5g3mk73Y9S1T6zQ84j1nliJ4GNX",
    };
    const fetchProducts = {
      query: ` mutation($name:String!,$price:numeric!,$image_path:String! ){
        insert_products_one(object:{
          name:$name,
          image_path:$image_path,
          price:$price
        }){
          id
        }
      }`,
      variables: { name: data.name, price: data.price, image_path: "" },
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: fetchProducts,
    });

    const products = response;
    console.log("add", products);
  };

  const allProducts = props.products;
  console.log(process.env.NEXT_HASURA_ADMIN_SECRET);

  // DELETE

  const handleDeleteProduct = async (id) => {
    const endpoint = "https://nextjs-hasura-12.hasura.app/v1/graphql";
    const headers = {
      "content-type": "application/json",
      "x-hasura-admin-secret":
        "pZg65ZTrvsBXkLUz9QoZDfiswwm74eZgFayLj5g3mk73Y9S1T6zQ84j1nliJ4GNX",
    };
    const fetchProducts = {
      query: `mutation($id:Int!){
      delete_products_by_pk(id:$id){
        id
        name
      }
    }`,
      variables: { id },
    };

    const response = await axios({
      url: endpoint,
      method: "post",
      headers: headers,
      data: fetchProducts,
    });

    const products = response;
    console.log("delete", products);
  };

  return (
    <>
      <Head>
        <title>Getting Started with Next.js</title>
      </Head>

      <div className="container ">
        <h1>Getting Started with E-commerce Website</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("name", { required: true })}
            placeholder="write product name"
          />
          {errors.exampleRequired && (
            <span className="text-danger">Product name is required</span>
          )}

          <input
            {...register("price", { required: true })}
            placeholder="Write product price"
          />
          {errors.exampleRequired && (
            <span className="text-danger">Product price is required</span>
          )}

          <input type="submit" />
        </form>
        <div className="row">
          {allProducts?.map(({ name, price, id, image_path }) => (
            <Card
              style={{ width: "18rem" }}
              key={id}
              className="col-md-3 col-sm-4 mx-3 my-2"
            >
              <Card.Img variant="top" src={image_path} />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>Price: {price}</Card.Text>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Button
                    variant="success"
                    onClick={() => handleDeleteProduct(id)}
                  >
                    Delete
                  </Button>
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

export default Index;

export const getStaticProps = async (context) => {
  const endpoint = process.env.NEXT_PUBLIC_HASURA_PROJECT_ENDPOINT;
  const headers = {
    "content-type": "application/json",
    "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
  };
  const graphqlQuery = {
    operationName: "fetchProducts",
    query: `
          query fetchProducts{
            products{
              id
              name
              image_path
              price
            }
          }`,
  };

  const response = await axios({
    url: endpoint,
    method: "post",
    headers: headers,
    data: graphqlQuery,
  });

  const products = response.data.data.products;
  console.log("productss", products);

  return {
    props: { products: products },
  };
};
