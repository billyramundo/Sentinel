## Current Functionality
including any known bugs, assumptions, or limitations

Currently, our project has the ability to lock and unlock a door through an in-app button press, NFC tap, iOS shortcuts, and Siri. It is also possible to create an account and log in with credentials being stored securily. Our project also allows a user to register ownership of doors as well as share access and ownership of those doors. Shared access can also be assigned to certain timeframes. Shared access allows other users to lock and unlock doors which do not belong to them. Also, a user can search friends by username to give them access to their door. Nativebase also gives the functionality of text-to-voice for all the text on the page.

One bug that exists is if an owner tries to give themselves access to their own door-- it's an unhandled rejection that we don't have a catch for. Another issue is that on the add access rules page-- a user who is in the middle of adding new access rules then hits the back button isn't given a speed bump asking them if they want to continue and explaining that their changes will be lost. Also, our share owner feature does not work properly.

Some limitations for our project include that it a user must have a smartphone in order to use the application.  Other limitations include the inability to delete an account and lack of a "forgot password" option, so a user who forgot their password would need to create a new account with a new email. Right now, you also cannot remove ownership of a door or registration of a door. We also haven't implemented a notifications feature, or any settings contained within the app. Currently, a user also has to know someone's exact username to search them up on the find my friends screen. There also are not many ways for a user to customize the app based on their personal security preferences-- perhaps they would want a confirmation button everytime they lock their door. Another limitation happens on sign in-- the home screen takes a noticeable second ot two to load because of firebase limitations (signing in takes a long time).

## Platforms Tested On
iOS 15.1
macOS Monterey 12.0.1
