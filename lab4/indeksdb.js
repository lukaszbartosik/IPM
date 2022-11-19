export class IndexedDB 
{
    constructor(dbName, dbVersion, dbUpgrade) 
    {
      return new Promise((resolve, reject) => 
      {
        this.db = null;
  
        if (!('indexedDB' in window)) reject('not supported');
  
        const dbOpen = indexedDB.open(dbName, dbVersion);
  
        if (dbUpgrade) 
        {
  
          dbOpen.onupgradeneeded = e => 
          {
            dbUpgrade(dbOpen.result, e.oldVersion, e.newVersion);
          };
        }
  
        dbOpen.onsuccess = () => 
        {
          this.db = dbOpen.result;
          resolve( this );
        };
  
        dbOpen.onerror = e => 
        {
          reject(`IndexedDB error: ${ e.target.errorCode }`);
        };
  
      });
  
    };
}