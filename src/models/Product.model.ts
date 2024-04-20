import {Table, Column, Model, DataType, Default} from 'sequelize-typescript'

@Table({
    tableName: 'products',
})
export default class Product extends Model {
    @Column({
        type: DataType.STRING(100),
    })
    declare name: string

    @Default(0)
    @Column({
        type: DataType.FLOAT(10, 2),
    })
    declare price: number

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
    })
    declare availability: boolean
}
