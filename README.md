# **Green Universe Coin Backend**

![Project Logo](data:image/jpeg;base64,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)

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
