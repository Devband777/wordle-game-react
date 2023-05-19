<?php
// Read data from file
$data = file('data.txt', FILE_IGNORE_NEW_LINES);

// Initialize variables
$json = array();
$topic = '';
$items = array();

// Loop through data
foreach ($data as $line) {
  // Check if line is a topic
  if (strpos($line, '----') !== false) {
    // Add previous topic and items to JSON array
    if (!empty($topic) && !empty($items)) {
      $json[$topic] = $items;
    }
    // Reset variables for new topic
    $topic = '';
    $items = array();
  } else {
    // Check if line is a topic name
    if (empty($topic)) {
      $topic = $line;
    } else {
      // Add item to items array
      $items[] = $line;
    }
  }
}

// Add last topic and items to JSON array
if (!empty($topic) && !empty($items)) {
  $json[$topic] = $items;
}

// Encode array to JSON format
$json_data = json_encode($json, JSON_PRETTY_PRINT);

// Save JSON data to file
file_put_contents('data.json', $json_data);
