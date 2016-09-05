# JavaScript-Meteor-CMS

This is my personal vision on how software should work. 

The main conception here is MVVMC, where i use commands in term of "C".

Every program starts from data, data defines everything. So please start from VO (see lib/vos).

The main trick here is data binding - MVVM. I use https://viewmodel.org + VO. And there is no business logic in view. 

View just signalize that something is happen and all magic and data processing is made inside "commands".

Special tool for "commands" - Comman and Q-deferred. 
This allowed me to split functional parts and create what i called - FLOW programming.

Then see \client\views\components\menu

Sorry for this short description.
If you have any question please contact me, i'm open for discussion.

email: vladimir.minkin@gmail.com 

skype: rimidalv.niknim
