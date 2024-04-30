# Handy Hero Documentation

## Introduction
Handy Hero is a platform designed to connect service providers with homeowners, facilitating various home services. It prioritizes transparency in cost and service quality by enabling direct interaction between service providers and homeowners. The platform features customer ratings and feedback mechanisms, ensuring mutual benefits for both parties. Moreover, Handy Hero streamlines payment processes by integrating with the Square API, thereby ensuring transparency in financial transactions.

## Overview
Handy Hero utilizes a modern tech stack to deliver its services. The backend is built using NestJS, MongoDB, and Prisma, while the frontend is developed with React (Vite), ReactQuery, and Tailwind CSS. The integration with Square API enables seamless payment processing between customers and service providers.

## Features Implemented
- **User Authentication:** Implemented a signup and login functionality for both clients and service providers.
- **Client Dashboard:** Allows clients to search for services in their area, discover service providers, view ratings, and contact them.
- **Service Provider Profile:** Displays comprehensive information about service providers, including years of experience, average service cost, ratings, previous work, customer reviews, education, and profession.
- **Payment Integration:** Utilizes Square API for transparent payment processing from customers to service providers.

### Challenges Faced

- Technical Challenges:

1. Integrating the Square API for payment processing required careful handling of financial transactions and ensuring compliance with payment regulations.
2. Implementing a seamless user experience while maintaining transparency in service costs and quality posed challenges in UI/UX design and system architecture.

- Operational Challenges:

1. **Maintaining Confidentiality:** Ensuring the confidentiality of customer contact information while facilitating communication with service providers posed a challenge. To address this, we plan to introduce a chat feature in the near future, allowing clients to contact service providers without revealing personal information unless necessary.
   
2. **Prompt Service Provider Response:** Ensuring prompt responses from service providers to customer requests proved to be a significant challenge. To overcome this, we implemented NOVU for providing notifications to service providers whenever a client requested their service, ensuring timely communication and response.

3. **Ensuring Safety for Service Providers:** Creating a safe environment for service providers within the platform was a key concern. To address this, we implemented a rating system where service providers can also rate customers. If a customer receives negative ratings, they will not be matched with the same service provider for a month. Additionally, customers with multiple negative ratings may be blacklisted, ensuring a fair and respectful environment for service providers.

### Challenges Overcome
- Integrating the Square API for payment processing required careful handling of financial transactions and ensuring compliance with payment regulations.
- Implementing a seamless user experience while maintaining transparency in service costs and quality posed challenges in UI/UX design and system architecture.

## Usage Instructions
To run the project locally first the user need to install the required dependencies in both client and server side for package manager we are using **pnpm** so the very first command to run after git clone will be ```pnpm install``` on both client and server side
after this the user needs to setup some _environmental variables_ on both side all the required variables are already present in **example.env** file all you need to do is to create a **.env** file and create all those variables some values are already provided and some you need to fill yourself 
- for variables related to AWS you need to enter your own key if you don't have don't worry you can just enter any random string and voila.
at last all you need to do is run your app locally ```pnpm dev``` if in the child folder e.g client/server, from the parent folder it will be like  ```pnpm dev:server | pnpm dev:client```

## Testing
For testing purpose we have made two demo accounts for both Client and Service provider

**Client**
email: testuser1@gmail.com
password: testuser

**Service Provider**
email: testuser2@gmail.com
password: testuser2

Through client's account we can hire service provider, search from different categories and choose the best.
Through Service Provider's account we can create different services that they provide these services will be displayed on the client side also we can update the information of the service that we provider like change in the price, service quality and many more, also service provider have all the control over the client if they want to accept the offer made by them or not. 
## Future Improvements
There are some features that we wanted to add but unfortunately couldn't, so the improvements that we have thought is:
- Create **Feedback** so that client can get the best results for what they pay for.
- adding **maps** this will allow users to filter the service providers by their location to avoid conflicts as who wants to hire someone for fixing their badly aligned tiles from _100 miles_ away.
- MOST IMPORTANT **Better approach for payment method** as customer's security should need to be the priority.

## Conclusions
Handy Hero aims to revolutionize the home service industry by providing a transparent and efficient platform for connecting service providers with homeowners. With its user-friendly interface and robust backend architecture, Handy Hero strives to deliver a seamless experience for all users involved.

## Square App ID
App ID: sandbox-sq0idb-kFEvb-_1zo1FweToI8obqA
