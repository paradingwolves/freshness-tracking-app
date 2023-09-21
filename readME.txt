This application is meant to keep track of the expiry dates for your company's parishable goods.

To build this application we used React.js, Firebase, and Bootstrap 5

npm packages installed:
    - npm i firebase
    - npm i react-router-dom
    - npm i react-bootstrap bootstrap
    - npm i date-fns



------------------------------------------------------------------
    Date Modified: September 11, 2023
------------------------------------------------------------------
  1. Created react project
        - npx create-react-app freshness-tracking-app
  2. Created project layout 
  3. Created Firebase project   
        - create web project
        - use project sdk for the env file 
        - create Firestore Database collection
        - 
  4. Created env file, routes file and firebase config file
  5. created header and footer

------------------------------------------------------------------
    Date Modified: September 14, 2023
------------------------------------------------------------------
    1. Designed Stock Table to be nicer looking with better spacing.
        - added StockTable.css to StockTable component folder
    2. Added useEffect to StockTable: so it would load based on expiry date
    3. added logic to add classes based on expiry date to change background colour of row
    4. Pushing to check effectiveness /cm

------------------------------------------------------------------
    Date Modified: September 17, 2023
------------------------------------------------------------------
    1. Pagination on table.
        Pushing to check effectiveness /cm

------------------------------------------------------------------
    Date Modified: September 21, 2023
------------------------------------------------------------------
    1. Updated the Hook in RemoveStock.js 
        - renamed removeItemByName to updateQuantityToZero
        - instead of removing the document from the firebase collection, we update the document's quantity to 0
            * this allows us to scan a barcode of an item that has been written off previously and still have the product info
        - update the ExpireThisWeek.jsx component so that it now works with our new Hook
    2. Added the quantity field to the stock table
    3. updated ViewStock so that it does not display a product if the quantity = 0







This Application was created by Justin Brierley and Chantal Monette.
Visit https://justinbrierley.ca/ or https://chantalmonette.ca/ for website inqueries
