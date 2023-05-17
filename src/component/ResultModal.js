import { useState } from "react";
import { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export function ResultModal(props) {
 
  useEffect(()=> {
    const data = {
      items: ['Melissa McCarthy', 'Kevin Hart', 'John Candy', 'Will Ferrell', 'Amy Poehler'],
      topic: "COMEDY ACTORS",
      values: ['4', '2', '5', '1', '3']
    }
    const sortedData = data.items.sort((a, b) => {
      return data.values[data.items.indexOf(a)] - data.values[data.items.indexOf(b)];
    });
    
    console.log("aaaaaaaa",sortedData);
  }, [props.show])
  return (
    
  );
}
