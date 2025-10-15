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
    this.http.get('assets/db/db.json').subscribe(async (jsonExport: JsonSQLite) => {


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
      set: [{ statement: sqlcampaña, values: [campaña.cultivo, 1, campaña.hectareas, campaña.fechaSiembra] }]
    }).then((changes: capSQLiteChanges) => {
      // Si es web, debemos guardar el cambio en la webstore manualmente
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      return changes;

    }).catch(err => Promise.reject(err))


  }
  async createaplicacion(id_campaña: any, id_insumo: any) {

    let sqlcampaña = `INSERT INTO aplicacion (id_insumo, estado, id_campaña, fecha)VALUES (?, ?, ?, ?)`;
    const dbName = await this.getDbName();
    const hoy = new Date();
    const formato = hoy.toISOString().slice(0, 10);
    console.log(formato);
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [{ statement: sqlcampaña, values: [id_insumo, 1, id_campaña, formato] }]
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
  async readcamapana() {
    // Sentencia para leer todos los registros
    let sql = 'SELECT c.fecha,c.hecatareas,cu.imagen,c.id_cultivo,c.id_campaña,cu.id_tipo_cultivo,cu.descripcion,MAX(a.fecha) AS fecha_ultima,Count(a.fecha) AS cantidadapli FROM campaña AS c INNER JOIN cultivo AS cu ON c.id_cultivo = cu.id_cultivo LEFT JOIN aplicacion AS a ON a.id_campaña = c.id_campaña WHERE c.estado = 1 GROUP BY c.id_campaña';
    // Obtengo la base de datos
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let campanas: any[] = [];

      // Si es IOS y hay datos, elimino la primera fila
      // Esto se debe a que la primera fila es informacion de las tablas
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const campana = response.values[index];
        const [year, month, day] = campana.fecha.split('-').map(Number);
        const diffDias =  this.calculardias(campana.fecha);
        const diffDiasultimoinsumo = this.calculardias(campana.fecha_ultima);
        const fechaLocal = new Date(year, month - 1, day);
        const formatoLargo = fechaLocal.toLocaleDateString('es-PE', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });

        let datos = {
          id_cultivo: campana.id_cultivo,
          id_tipo_cultivo: campana.id_tipo_cultivo,
          id_campaña: campana.id_campaña,
          fecha: campana.fecha,
          formatoLargo: formatoLargo,
          hecatareas: campana.hecatareas,
          cantidadapli: campana.cantidadapli,
          descripcion: campana.descripcion,
          fecha_ultima: campana.fecha_ultima,
          diffDiasultimoinsumo: campana.fecha_ultima? 'Ultima aplicación hace '+ diffDiasultimoinsumo + ' Dias': 'Sin fumigaciones aún',
          dias: diffDias,
          imagen: campana.imagen

        }
        campanas.push(datos);
      }
      console.log(campanas);
      return campanas;

    }).catch(err => Promise.reject(err))
  }
   calculardias(date: any) {
    const fecha = new Date(date);

    const hoy = new Date();


    const diffMs = hoy.getTime() - fecha.getTime();


    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDias;
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
  async countcultivo() {

    let sql = 'SELECT count(*) as cantidad FROM "campaña" AS c INNER JOIN cultivo AS cu ON c.id_cultivo = cu.id_cultivo where c. estado=1';

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let cultivos: any;
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];

        cultivos = cultivo.cantidad;
      }

      return cultivos;

    }).catch(err => Promise.reject(err))
  }
  async countaplicacion() {

    let sql = 'SELECT count(*) as cantidad FROM aplicacion AS c INNER JOIN campaña AS cu ON c.id_campaña = cu.id_campaña where cu. estado=1';

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let cultivos: any;
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];

        cultivos = cultivo.cantidad;
      }

      return cultivos;

    }).catch(err => Promise.reject(err))
  }
  async readhistorial(id_campana: any) {

    let sql = 'SELECT * FROM aplicacion as c INNER JOIN insumo AS cu ON c.id_insumo = cu.id_insumo where c.id_campaña=' + id_campana;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let aplicacion: any[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const aplicaciones = response.values[index];
        const fecha = new Date(aplicaciones.fecha);

        const hoy = new Date();


        const diffMs = hoy.getTime() - fecha.getTime();


        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        let datos = {
          nombre: aplicaciones.name,
          ingrediente: 'Tebuconazol',
          fecha: 'Hace ' + diffDias + ' días',
          cultivo: 'Maíz',
          categoria: 'FUNGICIDA',
          icon: 'leaf-outline'
        }
        aplicacion.push(datos);
      }
      console.log(aplicacion);
      return aplicacion;

    }).catch(err => Promise.reject(err))
  }

  async readDepartamento() {

    let sql = 'SELECT * FROM departamento';

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

    let sql = 'SELECT * FROM provincia where id_departamento = ' + id_departamento;

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

    let sql = 'SELECT * FROM distrito where id_provincia = ' + id_provincia;

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
  async deletecampana(id: any) {
    // Sentencia para actualizar un registro
    let sql = 'UPDATE campaña SET estado=0 WHERE id_campaña=?';
    // Obtengo la base de datos
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            id
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
  async readplagas(datos: any) {

    let sql = 'SELECT cu.id_plaga,cu.nombre FROM insumo_plaga as c INNER JOIN plaga AS cu ON c.id_plaga = cu.id_plaga where c.id_insumo=' + datos.id_insumo;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let plagas: any[] = [];
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const plaga = response.values[index];
        let datos = {
          id_plaga: plaga.id_plaga,
          nombre: plaga.nombre,

        }
        plagas.push(datos);
      }
      datos.plaga = plagas;
      return datos;

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
  async readinsumo(name: string[]) {
    if (!name || name.length === 0) {

      return { values: [], result: [] };
    }
    const normalizeCol = (col: string) =>
      `LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(${col},'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u'))`;

    // Genera una condición LIKE por cada término
    const likeConditions = name
      .map(() => `${normalizeCol('i.name')} LIKE ${normalizeCol('?')}`)
      .join(' OR ');

    const sql = `
    SELECT
      i.descripcion as descripcion,
      i.name as name,
      i.id_insumo as id_insumo,
      g.nombre as Grupo_quimico,
      g.ingrediente as ingrediente,
      g.clase as clase,
      g.subgrupo as tipo,
      i.dosis_maxima as dosis_maxima,
      i.dosis_minima as dosis_minima,
      i.tipo_medicion as cantidad_cilindro,
      i.nivel_php_minimo as nivel_php_minimo,
      i.nivel_php_maximo as nivel_php_maximo,
      i.cuando_aplicar as cuando_aplicar,
      i.tiempo_espera as tiempo_espera,
      g.resistencia as resistencia,
      g.numeroaplicaciones as numeroaplicaciones
    FROM insumo as i
    INNER JOIN grupo AS g ON i.id_grupo = g.id_grupo
    WHERE ${likeConditions};
  `;

    // Pasar los valores con % para que LIKE haga coincidencias parciales
    const values = name.map(n => `%${n}%`);
    // Obtengo la base de datos
    const dbName = await this.getDbName();
    // Ejecutamos la sentencia
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: values // necesario para android
    }).then((response: capSQLiteValues) => {
      let insumo: any[] = [];
      let plagas: any[] = [];
      // Si es IOS y hay datos, elimino la primera fila
      // Esto se debe a que la primera fila es informacion de las tablas
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const campana = response.values[index];

        let datos = {
          descripcion: campana.descripcion,
          name: campana.name,
          id_insumo: campana.id_insumo,
          ingrediente: campana.ingrediente,
          Grupo_quimico: campana.Grupo_quimico,
          tipo: campana.tipo,
          dosis_maxima: campana.dosis_maxima,
          dosis_minima: campana.dosis_minima,
          cantidad_cilindro: campana.cantidad_cilindro,
          nivel_php_minimo: campana.nivel_php_minimo,
          nivel_php_maximo: campana.nivel_php_maximo,
          cuando_aplicar: campana.cuando_aplicar,
          tiempo_espera: campana.tiempo_espera,
          resistencia: campana.resistencia,
          plaga: plagas,
          numeroaplicaciones: campana.numeroaplicaciones
        }
        insumo.push(datos);
      }
      console.log(insumo);
      return insumo;

    }).catch(err => Promise.reject(err))
  }

async readaplicaciones(id_insumo:any,id_campaña:any) {

    let sql = 'SELECT count(*) as cantidad FROM aplicacion AS c where c.id_campaña='+id_campaña + ' and c.id_insumo='+id_insumo;

    const dbName = await this.getDbName();

    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: [] // necesario para android
    }).then((response: capSQLiteValues) => {
      let cultivos: any;
      if (this.isIOS && response.values.length > 0) {
        response.values.shift();
      }

      // recorremos los datos
      for (let index = 0; index < response.values.length; index++) {
        const cultivo = response.values[index];

        cultivos = cultivo.cantidad;
      }

      return cultivos;

    }).catch(err => Promise.reject(err))
  }
}
