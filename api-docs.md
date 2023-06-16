## Auth 
### [GET] {url}/auth/login
put firebase id token in Authorization header (without leading “Bearer” etc)

- If nothing in Authorization header
  ```
  401 UNAUTHORIZED
  {
  "success": false,
  "data": null,
  "message": "Please provide the token."
  }
  ```
- If id token exist but invalid (not from our firebase app, etc)
  ```
  401 UNAUTHORIZED
  {
  "success": false,
  "data": null,
  "message": "Invalid token."
  }
  ```
- If user registered
  ```
  200 OK
  {
      "success": true,
      "data": {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlJpY2t5IiwiZW1haWwiOiJyaWNreUBnbWFpbC5jb20iLCJpYXQiOjE2ODU1NDU2NzMsImV4cCI6MTY4NTYzMjA3M30.JOsYYXJCasH2-iOKzkwvB_C6W7aT4t2BAWBuNxXIvXs"
      },
      "message": "Login successful"
  }
  ```
- If user not yet registered
  ```
  401 UNAUTHORIZED
  {
      "success": false,
      "data": null,
      "message": "User is not yet registered."
  }
  ```

### [POST] {url}/auth/register
put **firebase id token** in Authorization header (without leading “Bearer” etc)

- Request example
  ```
  {
    "name": "John Doe",
    "height": 180,
    "weight": 75,
    "gender": "Male",
    "age": 30,
    "activityLevel": "Sedentary",
    "goal": "Lose Weight",
    "mealsPerDay": 3,
    "dietType": "Keto Diet"
  }
  ```
- With validation
  ```
    check("name").notEmpty().withMessage("Name is required."),
    check("height").isInt().withMessage("Must be int."),
    check("weight").isInt().withMessage("Must be int."),
    check("gender").isIn(["Male", "Female"]).withMessage("Invalid value."),
    check("age").isInt().withMessage("Must be int."),
    check("activityLevel")
      .isIn([
        "Sedentary",
        "Lightly Active",
        "Moderately Active",
        "Very Active",
        "Super Active",
      ])
      .withMessage("Invalid value."),
    check("goal")
      .isIn(["Lose Weight", "Maintain Weight", "Gain Weight"])
      .withMessage("Invalid value."),
    check("mealsPerDay").isInt().withMessage("Must be int."),
    check("dietType")
      .isIn([
        "Standard Balanced Diet",
        "High Carb Diet",
        "Keto Diet",
        "High Protein Diet",
        "Low Fat Diet",
      ])
      .withMessage("Invalid value."),
  ```
- Example of validation error
  ```
  400 BAD REQUEST
  {
      "success": false,
      "data": {
          "error": [
              {
                  "type": "field",
                  "msg": "Name is required.",
                  "path": "name",
                  "location": "body"
              },
              {
                  "type": "field",
                  "value": "SDD",
                  "msg": "Invalid value",
                  "path": "activityLevel",
                  "location": "body"
              }
          ]
      },
      "message": "Validation errors"
  }
  ```
- If success
  ```
  201 CREATED
  {
      "success": true,
      "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJyaWNreWFudG93bUBnbWFpbC5jb20iLCJpYXQiOjE2ODU5OTcyNDAsImV4cCI6MTY4NjA4MzY0MH0.Fk001hHBUWxJjFoikDhcwb15Ibb7F3di2N62TUCIKLI",
      "message": "User registered successfully."
  }
  ```
- Internal server error
  ```
  500 INTERNAL SERVER ERROR
  {
      "success": false,
      "data": {
          "error": "\nInvalid `prisma.user.create()` invocation:\n\n\nUnique constraint failed on the fields: (`firebaseId`)"
      },
      "message": "Error registering user"
  }
  ```
## Tracker
### [GET] {url}/tracker
- Example response:
  ```
  200 OK
  {
      "success": true,
      "message": "Success fetch tracker data.",
      "data": {
          "date": "2023-06-14",
          "nutritionGoal": {
              "calorieGoal": 2807,
              "proteinGoal": 281,
              "carbohydrateGoal": 211,
              "fatGoal": 94
          },
          "mealPlan": {
              "breakfast": [
                  {
                      "id": 2,
                      "foodId": "4823",
                      "servingId": "17042",
                      "foodName": "Taco or Tostada with Beef, Cheese and Lettuce",
                      "servingDescription": "1 serving (78 g)",
                      "calories": 221,
                      "protein": 10.88,
                      "carbohydrate": 16.2,
                      "fat": 12.65
                  }
              ],
              "lunch": [],
              "dinner": []
          },
          "eatenFood": {
              "breakfast": [],
              "lunch": [
                  {
                      "id": 5,
                      "foodId": "4743301",
                      "servingId": "4617233",
                      "foodName": "Quinoa (Cooked)",
                      "servingDescription": "1 cup cooked",
                      "calories": 229,
                      "protein": 8.01,
                      "carbohydrate": 42.17,
                      "fat": 3.55
                  }
              ],
              "dinner": [
                  {
                      "id": 1,
                      "foodId": "4823",
                      "servingId": "17042",
                      "foodName": "Taco or Tostada with Beef, Cheese and Lettuce",
                      "servingDescription": "1 serving (78 g)",
                      "calories": 221,
                      "protein": 10.88,
                      "carbohydrate": 16.2,
                      "fat": 12.65
                  }
              ]
          }
      }
  }
  ```

### [GET] {url}/tracker/history?page=<int>
default page is 0
- {url}/tracker/history?page=1
  ```
  {
      "success": true,
      "data": [
          {
              "date": "Thursday, 15 June 2023",
              "nutritionGoal": {
                  "calorieGoal": 2807,
                  "proteinGoal": 281,
                  "carbohydrateGoal": 211,
                  "fatGoal": 94
              },
              "eatenFood": []
          },
          {
              "date": "Wednesday, 14 June 2023",
              "nutritionGoal": {
                  "calorieGoal": 2807,
                  "proteinGoal": 281,
                  "carbohydrateGoal": 211,
                  "fatGoal": 94
              },
              "eatenFood": [
                  {
                      "foodId": "4823",
                      "servingId": "17042",
                      "foodName": "Taco or Tostada with Beef, Cheese and Lettuce",
                      "servingDescription": "1 serving (78 g)",
                      "calories": 221,
                      "protein": 10.88,
                      "carbohydrate": 16.2,
                      "fat": 12.65
                  },
                  {
                      "foodId": "4743301",
                      "servingId": "4617233",
                      "foodName": "Quinoa (Cooked)",
                      "servingDescription": "1 cup cooked",
                      "calories": 229,
                      "protein": 8.01,
                      "carbohydrate": 42.17,
                      "fat": 3.55
                  }
              ]
          }
      ],
      "message": "Success fetch history."
  }
  ```
## Food
### [GET] {url}/food/recommend?mealTime=all
mealTime can be all, breakfast, lunch, dinner
default is all

- If success
  ```
  {
    "success": true,
    "message": "Meal plan recommendation created succesfuly.",
    "data": null
  }
  ```

- Error
  ```
  {
    "success": false,
    "message": "Invalid mealTime query parameter. It should be either "breakfast", "lunch", "dinner", or "all".",
    "data": null
  }
  ```

### [GET] {url}/food/search?name=taco&page=2
query parameters name and page (default: 0)

- Response
  ```
  200 OK
  {
      "success": true,
      "message": "Success searching for quinoa.",
      "data": [
          {
              "foodId": "4743301",
              "servingId": "4617233",
              "foodName": "Quinoa (Cooked)",
              "servingDescription": "1 cup cooked",
              "calories": 229,
              "carbohydrate": 42.17,
              "protein": 8.01,
              "fat": 3.55
          },

          {
              "foodId": "27907",
              "servingId": "75192",
              "foodName": "Quinoa",
              "servingDescription": "1/4 cup",
              "calories": 160,
              "carbohydrate": 28,
              "protein": 6,
              "fat": 3
          },
          {
              "foodId": "7655955",
              "servingId": "7377359",
              "foodName": "Fully Cooked Organic Quinoa",
              "servingDescription": "1/2 cup",
              "calories": 140,
              "carbohydrate": 24,
              "protein": 5,
              "fat": 2
          },
          {
              "foodId": "974040",
              "servingId": "980937",
              "foodName": "Organic Quinoa",
              "servingDescription": "1/4 cup",
              "calories": 160,
              "carbohydrate": 29,
              "protein": 6,
              "fat": 2.5
          },
          {
              "foodId": "39712",
              "servingId": "40318",
              "foodName": "Quinoa",
              "servingDescription": "1 cup",
              "calories": 636,
              "carbohydrate": 117.13,
              "protein": 22.27,
              "fat": 9.86
          }
      ]
  }
  ```

- If food not found
  ```
  {
      "success": true,
      "message": "Success searching for awdawdawdaa.",
      "data": []
  }
  ```
- Errors
  ```
  {
      "success": false,
      "data": null,
      "message": "Error getting fatsecret access token."
  }


  {
      "success": false,
      "data": null,
      "message": "Error searching for food"
  }
  ```

### [GET] {url}/food/detail?foodId=4823&servingId=17042

- If food_id not found
  ```
  400 Bad req
  {
      "success": false,
      "message": "Invalid ID: food_id '48212312123123' does not exist",
      "data": null
  }
  ```

- If serving_id not found
  ```
  400 Bad Req
  {
      "success": false,
      "message": "Serving id '17' does not exist",
      "data": null
  }
  ```

- If found
  ```
  200 ok
  {
      "success": true,
      "message": "Success getting detail for undefined.",
      "data": {
          "foodId": "63021140",
          "servingId": "52143067",
          "foodName": "Air Fryer Thai Chicken Satay",
          "servingDescription": "1 serving",
          "calories": 225,
          "carbohydrate": 3,
          "protein": 33,
          "fat": 7,
          "saturatedFat": 2,
          "polyunsaturatedFat": null,
          "monounsaturatedFat": null,
          "transFat": null,
          "cholesterol": 162,
          "sodium": 577,
          "potassium": 439,
          "fiber": 1,
          "sugar": 1,
          "addedSugars": null,
          "vitaminD": null,
          "vitaminA": null,
          "vitaminC": 5,
          "calcium": 15,
          "iron": 5
      }
  }
  ```

### [POST] {url}:8000/food/mealPlan

- Request body
  ```
  {
      "foodId": "4743301",
      "servingId": "4617233",
      "mealTime": "lunch"
  }
  ```

- Respone
  ```
  {
      "success": true,
      "message": "Food added to the meal plan",
      "data": null
  }
  ```

### [DELETE] {url}/food/mealPlan?id=<int>`
- {url}/food/mealPlan?id=4
  ```
  200 OK
  {
      "success": true,
      "message": "Food deleted from the meal plan",
      "data": null
  }
  ```

### [POST] {url}/food/eaten?id=<int>

- {url}/food/eaten?id=4
  ```
  {
      "success": true,
      "message": "Meal type updated to EATEN",
      "data": null
  }
  ```

### [DELETE] {url}/food/mealPlan?id=<int>
- {url}/food/mealPlan?id=4
  ```
  {
      "success": true,
      "message": "Meal type updated to RECOMMENDED",
      "data": null
  }
  ```
