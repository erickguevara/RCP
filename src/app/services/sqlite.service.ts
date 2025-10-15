import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { JsonSQLite } from 'jeep-sqlite/dist/types/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  // Atributos

  // Observable para comprobar si la base de datos esta lista
  public dbReady: BehaviorSubject<boolean>;
  // Indica si estamos en web
  public isWeb: boolean;
  // Indica si estamos en IOS
  public isIOS: boolean;
  // Nombre de la base de datos
  public dbName: string;

  constructor(
    private http: HttpClient
  ) {
    this.dbReady = new BehaviorSubject(false);
    this.isWeb = false;
    this.isIOS = false;
    this.dbName = '';
  }

  async init() {

    const info = await Device.getInfo();
    // CapacitorSQLite no tiene disponible el metodo requestPermissions pero si existe y es llamable
    const sqlite = CapacitorSQLite as any;

    // Si estamos en android, pedimos permiso
    if (info.platform == 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error("Esta app necesita permisos para funcionar")
      }
      // Si estamos en web, iniciamos la web store
    } else if (info.platform == 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    } else if (info.platform == 'ios') {
      this.isIOS = true;
    }

    // Arrancamos la base de datos
    this.setupDatabase();

  }

  async setupDatabase() {

    // Obtenemos si ya hemos creado la base de datos
    const dbSetup = await Preferences.get({ key: 'first_setup_key' })

    // Sino la hemos creado, descargamos y creamos la base de datos
    if (!dbSetup.value) {
      this.downloadDatabase();
    } else {
      // Nos volvemos a conectar
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName })
      this.dbReady.next(true);
    }


  }

  downloadDatabase() {

    // Obtenemos el fichero assets/db/db.json
    this.http.get('assets/db/db2.json').subscribe(async (jsonExport: JsonSQLite) => {


      const jsonstring = JSON.stringify(jsonExport);
      // Validamos el objeto
      const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });

      // Si es valido
      if (isValid.result) {

        // Obtengo el nombre de la base de datos
        this.dbName = jsonExport.database;
        // Lo importo a la base de datos
        await CapacitorSQLite.importFromJson({ jsonstring });
        // Creo y abro una conexion a sqlite
        await CapacitorSQLite.createConnection({ database: this.dbName });
        await CapacitorSQLite.open({ database: this.dbName })

        // Marco que ya hemos descargado la base de datos
        await Preferences.set({ key: 'first_setup_key', value: '1' })
        // Guardo el nombre de la base de datos
        await Preferences.set({ key: 'dbname', value: this.dbName })

        // Indico que la base de datos esta lista
        this.dbReady.next(true);

      }

    })

  }

  async getDbName() {

    if (!this.dbName) {
      const dbname = await Preferences.get({ key: 'dbname' })
      if (dbname.value) {
        this.dbName = dbname.value
      }
    }
    return this.dbName;
  }

  async create(aplicaciones: any[], cultivo: string, hectareas: string) {
    console.log(cultivo);
    console.log(hectareas);
    let sqlcampaña = `INSERT INTO campaña (id_cultivo, estado, hecatareas)VALUES (?, ?, ?)`;
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlcampaña, values: [Number(cultivo), 1, hectareas] }]
    }).then((changes: capSQLiteChanges) => {
      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
    return changes;
 
    }).catch(err => Promise.reject(err))


  }
  
  async createCampaña(campaña: any) {

    let sqlcampaña = `INSERT INTO campaña (id_cultivo, estado, hecatareas, fecha)VALUES (?, ?, ?, ?)`;
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlcampaña, values: [Number(campaña.id_cultivo), 1, campaña.hectareas,campaña.fechaSiembra] }]
    }).then((changes: capSQLiteChanges) => {
      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
    return changes;
 
    }).catch(err => Promise.reject(err))


  }

  async read() {
    // Sentencia para leer todos los registros
    let sql = 'SELECT * FROM tipo_cultivo';
    // Obtengo la base de datos
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let tipo_cultivo: { id_tipo_cultivo: string; descripcion: string; imagen: string; estado: string }[] = [];

      // Si es IOS y hay datos, elimino la primera fila
      // Esto se debe a que la primera fila es informacion de las tablas
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const tipo_cultivos = response.values[index];
        let datos = {
          descripcion: tipo_cultivos.descripcion,
          id_tipo_cultivo: tipo_cultivos.id_tipo_cultivo,
          imagen: tipo_cultivos.imagen,
          estado: tipo_cultivos.estado
        }
        tipo_cultivo.push(datos);
      }
      console.log(tipo_cultivo);
      return tipo_cultivo;

    }).catch(err => Promise.reject(err))
  }
  async readCultivos(id_tipo_cultivo: any) {

    let sql = 'SELECT * FROM cultivo where id_tipo_cultivo=' + id_tipo_cultivo;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let cultivos: any[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];
        let datos = {
          descripcion: cultivo.descripcion,
          id_cultivo: cultivo.id_cultivo,
          img: cultivo.imagen,
        }
        cultivos.push(datos);
      }
      console.log(cultivos);
      return cultivos;

    }).catch(err => Promise.reject(err))
  }

  async readDepartamento() {

    let sql = 'SELECT * FROM departamento' ;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let departamentos: any[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];
        let datos = {
          descripcion: cultivo.nombre,
          id_departamento: cultivo.id_departamento,
          
        }
        departamentos.push(datos);
      }
      console.log(departamentos);
      return departamentos;

    }).catch(err => Promise.reject(err))
  }

  async readprovincia(id_departamento: any) {

    let sql = 'SELECT * FROM provincia where id_departamento = '+ id_departamento ;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let provincia: any[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];
        let datos = {
          descripcion: cultivo.nombre,
          id_provincia: cultivo.id_provincia,
          
        }
        provincia.push(datos);
      }
      console.log(provincia);
      return provincia;

    }).catch(err => Promise.reject(err))
  }
   async readdistrito(id_provincia: any) {

    let sql = 'SELECT * FROM distrito where id_provincia = '+ id_provincia ;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let distrito: any[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];
        let datos = {
          descripcion: cultivo.nombre,
          id_distrito: cultivo.id_distrito,
          
        }
        distrito.push(datos);
      }
      console.log(distrito);
      return distrito;

    }).catch(err => Promise.reject(err))
  }
  async update(newLanguage: string, originalLanguage: string) {
    // Sentencia para actualizar un registro
    let sql = 'UPDATE languages SET name=? WHERE name=?';
    // Obtengo la base de datos
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            newLanguage,
            originalLanguage
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err))
  }

  async delete(language: string) {
    // Sentencia para eliminar un registro
    let sql = 'DELETE FROM languages WHERE name=?';
    // Obtengo la base de datos
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            language
          ]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;
    }).catch(err => Promise.reject(err))
  }

}
