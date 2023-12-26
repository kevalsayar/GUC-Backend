# **Green Universe Coin Backend**

![Project Logo](https://miro.medium.com/v2/resize:fit:1080/1*5rPLfV_tIe5IOS3QiN933g.jpeg)

[![Node.js](https://img.shields.io/badge/node-%5E14.0.0-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)
[![npm](https://img.shields.io/badge/npm-%5E6.0.0-orange)](https://www.npmjs.com/)

## **Overview**

Welcome to the backend repository for Green Universe Coin – the platform that leverages web3 cryptocurrency wallets to enable users to invest in environmentally conscious projects. This README provides information on setting up and using the backend API, including details on the 'users,' 'project,' 'project category,' and 'donationHistory' modules.

## **Table of Contents**

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
2. [Installation](#installation)
   - [Clone with HTTPS](#clone-with-https)
   - [Clone with SSH](#clone-with-ssh)
   - [Navigate to project directory](#navigate-to-project)
   - [Install dependencies](#install-dependencies)
3. [Configuration](#configuration)
   - [Environment Variables:](#environment-variables)
4. [Start Server](#start-server)

## **Getting Started**

Before diving into the details, make sure you have the following prerequisites:

### **Prerequisites**

- **Node.js:** This project is built with Node.js. Make sure you've Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

- **npm (Node Package Manager):** npm is the default package manager for Node.js. It is usually included with the Node.js installation. You can check if you have npm installed by running:

  ```bash
  npm -v
  ```

- **MySQL:** This project uses MySQL as the database. Make sure you have MySQL installed and running. You can download MySQL from [mysql.com.](https://www.mysql.com/) Follow the installation instructions for your operating system.

## **Installation**

Now that you have met the prerequisites, follow these steps to install and run the project:

#### **Clone with HTTPS**

```bash
# Clone the repository with HTTPS.
git clone https://github.com/kevalsayar/GUC-Backend.git
```

#### **Clone with SSH**

```bash
# Clone the repository with SSH.
git clone git@github.com:kevalsayar/GUC-Backend.git
```

#### **Navigate to project directory**

```bash
cd GUC-Backend
```

#### **Install dependencies**

```bash
$ npm install
```

## **Configuration**

### **Environment Variables**

Create a new file named .env in the root of the project. Copy the variable names from the example.env file and populate their values in the .env file.

## **Start server**

```bash
$ npm start
```
