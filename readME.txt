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
    3. updated ViewStock, ExpireThisWeek, ExpireToday, ExpiringSoon hooks so that they do not display a product if the quantity = 0
    4. Update the AddStock.jsx component so that there is a form that is auto populated by the matching data from
        the barcode scan

------------------------------------------------------------------
    Date Modified: September 22, 2023
------------------------------------------------------------------
    1. created the UpdateSticker hook that updates the discount level of the product
        - when the Red Sticker Updated button is clicked, the 'updated' property of that document is increased by 1
    2. updated the ExpireToday, ExpireThisWeek components so that the Red Sticker Updated button is not visible
        when the 'updated' property is at the highest level(3)
    3. updated the StockTable component to display what discount the product currently is at

------------------------------------------------------------------
    Date Modified: September 25, 2023
------------------------------------------------------------------
    1. updated the filter display to exclude other filters in each section.
    2. updated mobile table view:
           - thead features shortforms of certain words(Quantity: QTY.)
           - product.name is shortened to exclude brand name
           - product.name is shortened to one line with ellipses.
       /cm

------------------------------------------------------------------
    Date Modified: September 26, 2023
------------------------------------------------------------------
    1. Updated the AddStock.jsx UI
    2. AddStock.jsx now has a form in case the scanner isnt working
    3. AddStock.jsx now works and adds new content to the db    
        - if there is matching item_number and expiry_date, the quantities are combined rather than adding a new item

------------------------------------------------------------------
    Date Modified: September 25, 2023
------------------------------------------------------------------
    1. updated filter logic to switch case
    2. added FilterSelect.jsx component to properly control the filter logic for the aesthetic
    3. changed search to item_number so user can search by name, brand or item number
    4. got rid of the brand name within the name column in the name for all sizes of screen.
    5. hamburger menu turns into a cat
            -- https://www.flaticon.com/free-icons/head" created by Ains

This Application was created by Justin Brierley and Chantal Monette.
Visit https://justinbrierley.ca/ or https://chantalmonette.ca/ for website inqueries
