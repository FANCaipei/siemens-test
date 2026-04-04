import { DataType, type TableRow } from '../store/tableDataStore'

export class StandardTextManager {

    static parseOneRecord(record: string, idx: number): Promise<TableRow> {
        const reg = /^([a-zA-Z0-9]+)(\s:\s)([a-zA-Z0-9]+)(\s:=\s)?([a-zA-Z0-9]+)?;$/g
        const [infoPart, comment] = record.split(' // ')

        const match = infoPart.match(reg)
        if (!match) {
          return Promise.reject(`Format error, cannot parse. line:${idx+2}: ${record}`)
        }

        const row: TableRow = {
            id: idx,
            name: '',
            dataType: DataType.BOOL,
            defaultValue: undefined,
            comment: comment?.trim(),
        }

        infoPart.replace(reg, (match, name, __, dataType, ___ , defaultValue) => {
            // console.log('match| ', match)
            // console.log('name| ', name)
            // console.log('dataType| ', dataType)
            // console.log('defaultValue| ', defaultValue)
          row.name = name
          row.dataType = dataType.toUpperCase() as DataType
          row.defaultValue = defaultValue?.toUpperCase()
          return match
        })

        // check if type ok
        switch (row.dataType) {
          case DataType.INT:
          case DataType.BOOL:
            break
          default:
            return Promise.reject(`Unsupported data type: ${row.dataType}. line:${idx+2}: ${record}`)
        }

        // check defaultValue
        if (row.defaultValue === undefined) {
          switch (row.dataType) {
            case DataType.INT:
              row.defaultValue = 0
              break
            case DataType.BOOL:
              row.defaultValue = 'TRUE'
              break
          }
        }
        switch (row.dataType) {
          case DataType.INT:
            if(isNaN(Number(row.defaultValue))) {
              return Promise.reject(`Invalid INT value: ${row.defaultValue}. line:${idx+2}: ${record}`)
            }
            break
          case DataType.BOOL:
            if(row.defaultValue !== 'TRUE' && row.defaultValue !== 'FALSE') {
              return Promise.reject(`Invalid BOOL value: ${row.defaultValue}. line:${idx+2}: ${record}`)
            }
            break
        }

        return Promise.resolve(row)
    }

    static async parse(text: string): Promise<TableRow[]> {
        const records = text.split('\n')
        if (records.length < 2) {
        return Promise.reject('Format error, cannot parse')
        }
        if (records[0]?.trim() !== 'VAR') {
        return Promise.reject('Format error, cannot parse')
        }
        if (records[records.length - 1]?.trim() !== 'END_VAR') {
        return Promise.reject('Format error, cannot parse')
        }

        records.shift()
        records.pop()

        return Promise.all(records.map((record, idx) => {
        return this.parseOneRecord(record, idx)
        }))
    }

    static serialize(tableData: TableRow[]): string {
        return 'VAR\n' +
            tableData.map((row) => {
                let result = `${row.name} : ${row.dataType}`
                if(row.defaultValue !== undefined) {
                    result += ` := ${row.defaultValue}`
                }
                result += ';'
                if(row.comment?.trim()?.length > 0) {
                    result += ` // ${row.comment}`
                }
                
                return result
            }).join('\n')
        + '\nEND_VAR'
    }
}