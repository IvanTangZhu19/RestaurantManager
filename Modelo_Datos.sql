CREATE USER RestaurantManager IDENTIFIED BY "unaClav3" DEFAULT TABLESPACE "USERS" TEMPORARY TABLESPACE "TEMP";

ALTER USER RestaurantManager quota unlimited ON "USERS";

-- Se otorgan permisos
grant connect to RestaurantManager;
grant create session to RestaurantManager;
grant create table to RestaurantManager;
grant create view to RestaurantManager;
grant create sequence to RestaurantManager;
grant create trigger to RestaurantManager;
grant create procedure to RestaurantManager;

create table RestaurantManager.Roles
(
    id number not null,
    nombre varchar2(60) not null,
    constraint rol_pk primary key (id) enable
);

create table RestaurantManager.Usuarios
(
    id number not null,
    nombre varchar2(50) not null,
    contraseña varchar2(100) not null,
    rolID number not null,
    constraint usuario_rol_fk foreign key (rolID) references RestaurantManager.Roles(id) enable,
    constraint usuario_pk primary key (id) enable
);

create table RestaurantManager.Productos
(
    id number not null,
    nombre varchar2(50) not null,
    precio float not null,
    costo float not null,
    constraint producto_pk primary key (id) enable
);

create table RestaurantManager.Clientes
(
    id number not null,
    nombre varchar2(50) not null,
    direccion varchar2(50) not null,
    descripcion varchar2(50) not null,
    telefono varchar2(50) not null,
    constraint cliente_pk primary key (id) enable
);

create table RestaurantManager.Pedidos
(
    id number not null,
    fecha timestamp not null,
    clienteID number not null,
    constraint pedido_cliente_fk foreign key (clienteID) references RestaurantManager.Clientes(id) enable,
    constraint pedido_pk primary key (id) enable
);

create table RestaurantManager.Pedidos_Productos
(
    id number not null,
    pedidoID number not null,
    productoID number not null,
    constraint pedido_productos_pedido_fk foreign key (pedidoID) references RestaurantManager.Pedidos(id) enable,
    constraint pedido_productos_producto_fk foreign key (productoID) references RestaurantManager.productos(id) enable,
    constraint pedido_productos_pk primary key (id) enable
);