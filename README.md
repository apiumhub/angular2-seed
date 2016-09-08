To Run Karma tests with Intellij Idea:
* modify file ~/.IntelliJIdea15/config/plugins/js-karma/js\_reporter/karma-intellij/lib/intellijRunner.js 
* line 63, change from *refresh: false* to *refresh: true*

To continuously compile, either:
* (suggested:) use npm plugin (tsc:w script), or
* write *npm run tsc:w*, or
* set up a custom compiler in idea settings (ctrl+shift+s): /usr/lib/node\_modules/typescript/bin 
** tell to use config from tsconfig.json
** set up a typescript file watcher


 


