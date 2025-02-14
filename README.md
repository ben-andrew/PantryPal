# INSTALLATION

## Get started

1. Clone the git repo

   ```bash
   git clone https://github.com/ben-andrew/PantryPal.git
   cd PantryPal
   git checkout newMaster (you can also do "git checkout (other branch name)" to go to a different branch"
   ```

2. Add the API Keys

   create a file called "apiKeys.js" and put it in the root directory(same folder as App.js, index.js, etc)
   It should have format...
   ```bash
   export default keys = {
      // the API anon key
      anon: "anon api key here",
    
      // the url
      url: "supabase project url here"
   };
   ```
   anon API key and project URL are both in settings/configuration/"Data API" in the supabase project


3. Install dependencies

   ```bash
   npm install
   ```

4. Start the app

   ```bash
   npx expo start
   OR   
   npx expo start --tunnel (if using wsl for IOS testing)
   ```
# PantryPal: Track Your Pantry Stock and Minimize Food Waste

## Project Description:
According to ReFED, a U.S.-based nonprofit organization aimed to stop food waste, almost half of the food waste in America is due to consumers; who, by the way, spent an average of almost 800 dollars each in 2023 on uneaten food! PantryPal is a mobile app that helps you to track your food stock, find recipes to use your current stock, and plan meals to avoid over-buying. With features such as a computer vision receipt scanner, recipe suggestion AI, and a stock manager, you can stop worrying about the hard questions like: “What should I make tonight?," “How can I use my leftover vegetables before they go bad?,” and “What do I need to buy this week?”

PantryPal. The app that food waste fears!

## Proposed Features: 
* **Computer Vision Receipt Scanner**: scan your receipts and quickly record all new stock items into your pantry.
* **Recipe Suggestion AI**: analyzes your current stock, expiration dates, and cuisine preferences to suggest recipes to use the food you have.
* **Stock Manager**: when you make a recipe, the pantry stock database is automatically updated and the stock used is removed.
* **Recipe Creator**: manually enter personal or family receipts into the recipe database.
* **Meal Planning Calendar**: Plan your meals in advance into the in-app calendar.
* **Shopping List Generator**: all items from planned meals that are not in your current stock will be added to your shopping list.

## Target Platform: 
* Mobile App

## Proposed Technologies:
Still doing research on different languages, databases, and frameworks, but these are some ideas.
* **Backend**: Python Django or Flask.
* **Frontend**: ReactNative
* **Database**: SQL


## The following is EXPO boilerplate text that they give you
## You might fingd it helpful, or not!

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
