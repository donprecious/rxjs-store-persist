"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncStateUpdate = exports.rehydrateApplicationState = exports.storageSync = void 0;
const deepmerge = require("deepmerge");
const helpers_1 = require("./helpers");
const options_1 = require("./options");
const INIT_ACTION = '@ngrx/store/init';
const UPDATE_ACTION = '@ngrx/store/update-reducers';
function storageSync(reducer) {
    const stateKeys = (0, helpers_1.validateStateKeys)(options_1.config.keys);
    const rehydratedState = (0, exports.rehydrateApplicationState)(stateKeys, options_1.config.storage);
    return function (state, action) {
        let nextState;
        if ((action.type === INIT_ACTION) && !state) {
            nextState = reducer(state, action);
        }
        else {
            nextState = Object.assign({}, state);
        }
        if (action.type === INIT_ACTION || action.type === UPDATE_ACTION) {
            // @ts-ignore
            const overwriteMerge = (destinationArray, sourceArray) => sourceArray;
            const options = {
                arrayMerge: overwriteMerge
            };
            nextState = deepmerge(nextState, rehydratedState, options);
        }
        nextState = reducer(nextState, action);
        if (action.type !== INIT_ACTION) {
            (0, exports.syncStateUpdate)(nextState, stateKeys, options_1.config.storage);
        }
        return nextState;
    };
}
exports.storageSync = storageSync;
const rehydrateApplicationState = (keys, storage) => {
    return keys.reduce((acc, curr) => {
        let key = curr;
        if (storage !== undefined) {
            let stateSlice = storage.getItem(key);
            if (stateSlice) {
                const isObjectRegex = new RegExp('{|\\[');
                let raw = stateSlice;
                if (stateSlice === 'null' || isObjectRegex.test(stateSlice.charAt(0))) {
                    raw = JSON.parse(stateSlice);
                }
                return Object.assign({}, acc, {
                    [key]: raw
                });
            }
        }
        return acc;
    }, {});
};
exports.rehydrateApplicationState = rehydrateApplicationState;
const syncStateUpdate = (state, keys, storage) => {
    keys.forEach(key => {
        let stateSlice = state[key];
        let replacer = undefined;
        let space = undefined;
        if (typeof stateSlice !== 'undefined' && storage !== undefined) {
            try {
                storage.setItem(key, typeof stateSlice === 'string'
                    ? stateSlice
                    : JSON.stringify(stateSlice, replacer, space));
            }
            catch (e) {
                console.warn('Unable to save state to localStorage:', e);
            }
        }
        else if (typeof stateSlice === 'undefined') {
            try {
                storage.removeItem(key);
            }
            catch (e) {
                console.warn(`Exception on removing/cleaning undefined '${key}' state`, e);
            }
        }
    });
};
exports.syncStateUpdate = syncStateUpdate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1zeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N0b3JhZ2Utc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBdUM7QUFDdkMsdUNBQTRDO0FBQzVDLHVDQUFpQztBQUVqQyxNQUFNLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztBQUN2QyxNQUFNLGFBQWEsR0FBRyw2QkFBNkIsQ0FBQztBQUVwRCxTQUFnQixXQUFXLENBQUMsT0FBWTtJQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFBLDJCQUFpQixFQUFDLGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakQsTUFBTSxlQUFlLEdBQUcsSUFBQSxpQ0FBeUIsRUFBQyxTQUFTLEVBQUUsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU3RSxPQUFPLFVBQVUsS0FBVSxFQUFFLE1BQVc7UUFDcEMsSUFBSSxTQUFTLENBQUM7UUFFZCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUN6QyxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN0QzthQUFNO1lBQ0gsU0FBUyxxQkFBTyxLQUFLLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUU7WUFDOUQsYUFBYTtZQUNiLE1BQU0sY0FBYyxHQUFHLENBQUMsZ0JBQXFCLEVBQUUsV0FBZ0IsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ2hGLE1BQU0sT0FBTyxHQUFzQjtnQkFDL0IsVUFBVSxFQUFFLGNBQWM7YUFDN0IsQ0FBQztZQUNGLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5RDtRQUVELFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRXZDLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDN0IsSUFBQSx1QkFBZSxFQUNYLFNBQVMsRUFDVCxTQUFTLEVBQ1QsZ0JBQU0sQ0FBQyxPQUFPLENBQ2pCLENBQUM7U0FDTDtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztBQUNOLENBQUM7QUFqQ0Qsa0NBaUNDO0FBRU0sTUFBTSx5QkFBeUIsR0FBRyxDQUNyQyxJQUFXLEVBQ1gsT0FBZ0IsRUFDbEIsRUFBRTtJQUNBLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUM3QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFZixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDdkIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QyxJQUFJLFVBQVUsRUFBRTtnQkFDWixNQUFNLGFBQWEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDO2dCQUVyQixJQUFJLFVBQVUsS0FBSyxNQUFNLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ25FLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNoQztnQkFFRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRTtvQkFDMUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHO2lCQUNiLENBQUMsQ0FBQzthQUNOO1NBQ0o7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQztBQXhCVyxRQUFBLHlCQUF5Qiw2QkF3QnBDO0FBRUssTUFBTSxlQUFlLEdBQUcsQ0FDM0IsS0FBVSxFQUNWLElBQVcsRUFDWCxPQUFnQixFQUNsQixFQUFFO0lBQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNmLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLFFBQVEsR0FBRyxTQUFTLENBQUM7UUFDekIsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDO1FBRXRCLElBQUksT0FBTyxVQUFVLEtBQUssV0FBVyxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7WUFDNUQsSUFBSTtnQkFDQSxPQUFPLENBQUMsT0FBTyxDQUNYLEdBQUcsRUFDSCxPQUFPLFVBQVUsS0FBSyxRQUFRO29CQUMxQixDQUFDLENBQUMsVUFBVTtvQkFDWixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUNwRCxDQUFDO2FBQ0w7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzVEO1NBQ0o7YUFBTSxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVcsRUFBRTtZQUMxQyxJQUFJO2dCQUNBLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDM0I7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixPQUFPLENBQUMsSUFBSSxDQUNSLDZDQUE2QyxHQUFHLFNBQVMsRUFDekQsQ0FBQyxDQUNKLENBQUM7YUFDTDtTQUNKO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFoQ1csUUFBQSxlQUFlLG1CQWdDMUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBkZWVwbWVyZ2UgZnJvbSBcImRlZXBtZXJnZVwiO1xuaW1wb3J0IHt2YWxpZGF0ZVN0YXRlS2V5c30gZnJvbSBcIi4vaGVscGVyc1wiO1xuaW1wb3J0IHtjb25maWd9IGZyb20gXCIuL29wdGlvbnNcIjtcblxuY29uc3QgSU5JVF9BQ1RJT04gPSAnQG5ncngvc3RvcmUvaW5pdCc7XG5jb25zdCBVUERBVEVfQUNUSU9OID0gJ0BuZ3J4L3N0b3JlL3VwZGF0ZS1yZWR1Y2Vycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9yYWdlU3luYyhyZWR1Y2VyOiBhbnkpIHtcbiAgICBjb25zdCBzdGF0ZUtleXMgPSB2YWxpZGF0ZVN0YXRlS2V5cyhjb25maWcua2V5cyk7XG4gICAgY29uc3QgcmVoeWRyYXRlZFN0YXRlID0gcmVoeWRyYXRlQXBwbGljYXRpb25TdGF0ZShzdGF0ZUtleXMsIGNvbmZpZy5zdG9yYWdlKTtcblxuICAgIHJldHVybiBmdW5jdGlvbiAoc3RhdGU6IGFueSwgYWN0aW9uOiBhbnkpIHtcbiAgICAgICAgbGV0IG5leHRTdGF0ZTtcblxuICAgICAgICBpZiAoKGFjdGlvbi50eXBlID09PSBJTklUX0FDVElPTikgJiYgIXN0YXRlKSB7XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV4dFN0YXRlID0gey4uLnN0YXRlfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYWN0aW9uLnR5cGUgPT09IElOSVRfQUNUSU9OIHx8IGFjdGlvbi50eXBlID09PSBVUERBVEVfQUNUSU9OKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICBjb25zdCBvdmVyd3JpdGVNZXJnZSA9IChkZXN0aW5hdGlvbkFycmF5OiBhbnksIHNvdXJjZUFycmF5OiBhbnkpID0+IHNvdXJjZUFycmF5O1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uczogZGVlcG1lcmdlLk9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgYXJyYXlNZXJnZTogb3ZlcndyaXRlTWVyZ2VcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBuZXh0U3RhdGUgPSBkZWVwbWVyZ2UobmV4dFN0YXRlLCByZWh5ZHJhdGVkU3RhdGUsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbmV4dFN0YXRlID0gcmVkdWNlcihuZXh0U3RhdGUsIGFjdGlvbik7XG5cbiAgICAgICAgaWYgKGFjdGlvbi50eXBlICE9PSBJTklUX0FDVElPTikge1xuICAgICAgICAgICAgc3luY1N0YXRlVXBkYXRlKFxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZSxcbiAgICAgICAgICAgICAgICBzdGF0ZUtleXMsXG4gICAgICAgICAgICAgICAgY29uZmlnLnN0b3JhZ2VcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV4dFN0YXRlO1xuICAgIH07XG59XG5cbmV4cG9ydCBjb25zdCByZWh5ZHJhdGVBcHBsaWNhdGlvblN0YXRlID0gKFxuICAgIGtleXM6IGFueVtdLFxuICAgIHN0b3JhZ2U6IFN0b3JhZ2VcbikgPT4ge1xuICAgIHJldHVybiBrZXlzLnJlZHVjZSgoYWNjLCBjdXJyKSA9PiB7XG4gICAgICAgIGxldCBrZXkgPSBjdXJyO1xuXG4gICAgICAgIGlmIChzdG9yYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBzdGF0ZVNsaWNlID0gc3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICBpZiAoc3RhdGVTbGljZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzT2JqZWN0UmVnZXggPSBuZXcgUmVnRXhwKCd7fFxcXFxbJyk7XG4gICAgICAgICAgICAgICAgbGV0IHJhdyA9IHN0YXRlU2xpY2U7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3RhdGVTbGljZSA9PT0gJ251bGwnIHx8IGlzT2JqZWN0UmVnZXgudGVzdChzdGF0ZVNsaWNlLmNoYXJBdCgwKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmF3ID0gSlNPTi5wYXJzZShzdGF0ZVNsaWNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgYWNjLCB7XG4gICAgICAgICAgICAgICAgICAgIFtrZXldOiByYXdcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBzeW5jU3RhdGVVcGRhdGUgPSAoXG4gICAgc3RhdGU6IGFueSxcbiAgICBrZXlzOiBhbnlbXSxcbiAgICBzdG9yYWdlOiBTdG9yYWdlXG4pID0+IHtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgbGV0IHN0YXRlU2xpY2UgPSBzdGF0ZVtrZXldO1xuICAgICAgICBsZXQgcmVwbGFjZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBzcGFjZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAodHlwZW9mIHN0YXRlU2xpY2UgIT09ICd1bmRlZmluZWQnICYmIHN0b3JhZ2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBzdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHN0YXRlU2xpY2UgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHN0YXRlU2xpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIDogSlNPTi5zdHJpbmdpZnkoc3RhdGVTbGljZSwgcmVwbGFjZXIsIHNwYWNlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdVbmFibGUgdG8gc2F2ZSBzdGF0ZSB0byBsb2NhbFN0b3JhZ2U6JywgZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0YXRlU2xpY2UgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgYEV4Y2VwdGlvbiBvbiByZW1vdmluZy9jbGVhbmluZyB1bmRlZmluZWQgJyR7a2V5fScgc3RhdGVgLFxuICAgICAgICAgICAgICAgICAgICBlXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufTtcbiJdfQ==