"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const list_1 = require("./list");
const logging_1 = require("./logging");
const publish_1 = require("./publish");
const lib_1 = require("../lib");
async function main() {
    const argv = yargs
        .usage('$0 <cmd> [args]')
        .option('verbose', {
        alias: 'v',
        type: 'boolean',
        desc: 'Increase logging verbosity',
        count: true,
        default: 0,
    })
        .option('path', {
        alias: 'p',
        type: 'string',
        desc: 'The path (file or directory) to load the assets from. If a directory, ' +
            `the file '${lib_1.AssetManifest.DEFAULT_FILENAME}' will be loaded from it.`,
        default: '.',
        requiresArg: true,
    })
        .command('ls', 'List assets from the given manifest', command => command, wrapHandler(async (args) => {
        await (0, list_1.list)(args);
    }))
        .command('publish [ASSET..]', 'Publish assets in the given manifest', command => command
        .option('profile', { type: 'string', describe: 'Profile to use from AWS Credentials file' })
        .positional('ASSET', { type: 'string', array: true, describe: 'Assets to publish (format: "ASSET[:DEST]"), default all' }), wrapHandler(async (args) => {
        await (0, publish_1.publish)({
            path: args.path,
            assets: args.ASSET,
            profile: args.profile,
        });
    }))
        .demandCommand()
        .help()
        .strict() // Error on wrong command
        .version(logging_1.VERSION)
        .showHelpOnFail(false)
        .argv;
    // Evaluating .argv triggers the parsing but the command gets implicitly executed,
    // so we don't need the output.
    Array.isArray(argv);
}
/**
 * Wrap a command's handler with standard pre- and post-work
 */
function wrapHandler(handler) {
    return async (argv) => {
        if (argv.verbose) {
            (0, logging_1.setLogThreshold)('verbose');
        }
        await handler(argv);
    };
}
main().catch(e => {
    // eslint-disable-next-line no-console
    console.error(e.stack);
    process.exitCode = 1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWFzc2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNkay1hc3NldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IsaUNBQThCO0FBQzlCLHVDQUFxRDtBQUNyRCx1Q0FBb0M7QUFDcEMsZ0NBQXVDO0FBRXZDLEtBQUssVUFBVSxJQUFJO0lBQ2pCLE1BQU0sSUFBSSxHQUFHLEtBQUs7U0FDZixLQUFLLENBQUMsaUJBQWlCLENBQUM7U0FDeEIsTUFBTSxDQUFDLFNBQVMsRUFBRTtRQUNqQixLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxTQUFTO1FBQ2YsSUFBSSxFQUFFLDRCQUE0QjtRQUNsQyxLQUFLLEVBQUUsSUFBSTtRQUNYLE9BQU8sRUFBRSxDQUFDO0tBQ1gsQ0FBQztTQUNELE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDZCxLQUFLLEVBQUUsR0FBRztRQUNWLElBQUksRUFBRSxRQUFRO1FBQ2QsSUFBSSxFQUFFLHdFQUF3RTtZQUNoRixhQUFhLG1CQUFhLENBQUMsZ0JBQWdCLDJCQUEyQjtRQUNwRSxPQUFPLEVBQUUsR0FBRztRQUNaLFdBQVcsRUFBRSxJQUFJO0tBQ2xCLENBQUM7U0FDRCxPQUFPLENBQUMsSUFBSSxFQUFFLHFDQUFxQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUNwRSxXQUFXLENBQUMsS0FBSyxFQUFDLElBQUksRUFBQyxFQUFFO1FBQ3pCLE1BQU0sSUFBQSxXQUFJLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7U0FDSixPQUFPLENBQUMsbUJBQW1CLEVBQUUsc0NBQXNDLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPO1NBQ3JGLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSwwQ0FBMEMsRUFBRSxDQUFDO1NBQzNGLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLHlEQUF5RCxFQUFFLENBQUMsRUFDMUgsV0FBVyxDQUFDLEtBQUssRUFBQyxJQUFJLEVBQUMsRUFBRTtRQUN6QixNQUFNLElBQUEsaUJBQU8sRUFBQztZQUNaLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSztZQUNsQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87U0FDdEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDRixhQUFhLEVBQUU7U0FDZixJQUFJLEVBQUU7U0FDTixNQUFNLEVBQUUsQ0FBQyx5QkFBeUI7U0FDbEMsT0FBTyxDQUFDLGlCQUFPLENBQUM7U0FDaEIsY0FBYyxDQUFDLEtBQUssQ0FBQztTQUNyQixJQUFJLENBQUM7SUFFUixrRkFBa0Y7SUFDbEYsK0JBQStCO0lBQy9CLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxXQUFXLENBQW9DLE9BQTZCO0lBQ25GLE9BQU8sS0FBSyxFQUFFLElBQU8sRUFBRSxFQUFFO1FBQ3ZCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFBLHlCQUFlLEVBQUMsU0FBUyxDQUFDLENBQUM7U0FDNUI7UUFDRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO0lBQ2Ysc0NBQXNDO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IHsgbGlzdCB9IGZyb20gJy4vbGlzdCc7XG5pbXBvcnQgeyBzZXRMb2dUaHJlc2hvbGQsIFZFUlNJT04gfSBmcm9tICcuL2xvZ2dpbmcnO1xuaW1wb3J0IHsgcHVibGlzaCB9IGZyb20gJy4vcHVibGlzaCc7XG5pbXBvcnQgeyBBc3NldE1hbmlmZXN0IH0gZnJvbSAnLi4vbGliJztcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpIHtcbiAgY29uc3QgYXJndiA9IHlhcmdzXG4gICAgLnVzYWdlKCckMCA8Y21kPiBbYXJnc10nKVxuICAgIC5vcHRpb24oJ3ZlcmJvc2UnLCB7XG4gICAgICBhbGlhczogJ3YnLFxuICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgZGVzYzogJ0luY3JlYXNlIGxvZ2dpbmcgdmVyYm9zaXR5JyxcbiAgICAgIGNvdW50OiB0cnVlLFxuICAgICAgZGVmYXVsdDogMCxcbiAgICB9KVxuICAgIC5vcHRpb24oJ3BhdGgnLCB7XG4gICAgICBhbGlhczogJ3AnLFxuICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICBkZXNjOiAnVGhlIHBhdGggKGZpbGUgb3IgZGlyZWN0b3J5KSB0byBsb2FkIHRoZSBhc3NldHMgZnJvbS4gSWYgYSBkaXJlY3RvcnksICcgK1xuICAgIGB0aGUgZmlsZSAnJHtBc3NldE1hbmlmZXN0LkRFRkFVTFRfRklMRU5BTUV9JyB3aWxsIGJlIGxvYWRlZCBmcm9tIGl0LmAsXG4gICAgICBkZWZhdWx0OiAnLicsXG4gICAgICByZXF1aXJlc0FyZzogdHJ1ZSxcbiAgICB9KVxuICAgIC5jb21tYW5kKCdscycsICdMaXN0IGFzc2V0cyBmcm9tIHRoZSBnaXZlbiBtYW5pZmVzdCcsIGNvbW1hbmQgPT4gY29tbWFuZFxuICAgICAgLCB3cmFwSGFuZGxlcihhc3luYyBhcmdzID0+IHtcbiAgICAgICAgYXdhaXQgbGlzdChhcmdzKTtcbiAgICAgIH0pKVxuICAgIC5jb21tYW5kKCdwdWJsaXNoIFtBU1NFVC4uXScsICdQdWJsaXNoIGFzc2V0cyBpbiB0aGUgZ2l2ZW4gbWFuaWZlc3QnLCBjb21tYW5kID0+IGNvbW1hbmRcbiAgICAgIC5vcHRpb24oJ3Byb2ZpbGUnLCB7IHR5cGU6ICdzdHJpbmcnLCBkZXNjcmliZTogJ1Byb2ZpbGUgdG8gdXNlIGZyb20gQVdTIENyZWRlbnRpYWxzIGZpbGUnIH0pXG4gICAgICAucG9zaXRpb25hbCgnQVNTRVQnLCB7IHR5cGU6ICdzdHJpbmcnLCBhcnJheTogdHJ1ZSwgZGVzY3JpYmU6ICdBc3NldHMgdG8gcHVibGlzaCAoZm9ybWF0OiBcIkFTU0VUWzpERVNUXVwiKSwgZGVmYXVsdCBhbGwnIH0pXG4gICAgLCB3cmFwSGFuZGxlcihhc3luYyBhcmdzID0+IHtcbiAgICAgIGF3YWl0IHB1Ymxpc2goe1xuICAgICAgICBwYXRoOiBhcmdzLnBhdGgsXG4gICAgICAgIGFzc2V0czogYXJncy5BU1NFVCxcbiAgICAgICAgcHJvZmlsZTogYXJncy5wcm9maWxlLFxuICAgICAgfSk7XG4gICAgfSkpXG4gICAgLmRlbWFuZENvbW1hbmQoKVxuICAgIC5oZWxwKClcbiAgICAuc3RyaWN0KCkgLy8gRXJyb3Igb24gd3JvbmcgY29tbWFuZFxuICAgIC52ZXJzaW9uKFZFUlNJT04pXG4gICAgLnNob3dIZWxwT25GYWlsKGZhbHNlKVxuICAgIC5hcmd2O1xuXG4gIC8vIEV2YWx1YXRpbmcgLmFyZ3YgdHJpZ2dlcnMgdGhlIHBhcnNpbmcgYnV0IHRoZSBjb21tYW5kIGdldHMgaW1wbGljaXRseSBleGVjdXRlZCxcbiAgLy8gc28gd2UgZG9uJ3QgbmVlZCB0aGUgb3V0cHV0LlxuICBBcnJheS5pc0FycmF5KGFyZ3YpO1xufVxuXG4vKipcbiAqIFdyYXAgYSBjb21tYW5kJ3MgaGFuZGxlciB3aXRoIHN0YW5kYXJkIHByZS0gYW5kIHBvc3Qtd29ya1xuICovXG5mdW5jdGlvbiB3cmFwSGFuZGxlcjxBIGV4dGVuZHMgeyB2ZXJib3NlPzogbnVtYmVyIH0sIFI+KGhhbmRsZXI6ICh4OiBBKSA9PiBQcm9taXNlPFI+KSB7XG4gIHJldHVybiBhc3luYyAoYXJndjogQSkgPT4ge1xuICAgIGlmIChhcmd2LnZlcmJvc2UpIHtcbiAgICAgIHNldExvZ1RocmVzaG9sZCgndmVyYm9zZScpO1xuICAgIH1cbiAgICBhd2FpdCBoYW5kbGVyKGFyZ3YpO1xuICB9O1xufVxuXG5tYWluKCkuY2F0Y2goZSA9PiB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gIHByb2Nlc3MuZXhpdENvZGUgPSAxO1xufSk7XG4iXX0=