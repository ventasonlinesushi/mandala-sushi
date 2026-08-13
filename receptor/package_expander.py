# -*- coding: utf-8 -*-
"""Desglosa paquetes en productos de producción sin modificar la cuenta."""


def _linea(nombre, cantidad=1, estacion=None):
    linea = {"cantidad": int(cantidad), "nombre": nombre, "total_linea": 0.0}
    if estacion:
        linea["estacion"] = estacion
    return linea


def _selecciones(nombre):
    if " · " not in nombre:
        return []
    return [x.strip() for x in nombre.split(" · ", 1)[1].split(" + ") if x.strip()]


def _rollos(nombre, esperados, cantidad_paquete):
    elegidos = _selecciones(nombre)
    lineas = [_linea(rollo, cantidad_paquete, "sushi") for rollo in elegidos]
    if len(elegidos) != esperados:
        lineas.append(_linea("ATENCION: ROLLOS DEL PAQUETE NO ESPECIFICADOS", cantidad_paquete, "sushi"))
    return lineas


def expandir_items(items, marca="mandala"):
    salida = []
    for item in items or []:
        inicio = len(salida)
        es_paquete = False
        nombre = str(item.get("nombre") or item.get("name") or "").strip()
        cantidad = int(item.get("cantidad") or item.get("qty") or 1)
        bajo = nombre.lower()
        if bajo.startswith("2 rollos x $169"):
            es_paquete = True
            salida.extend(_rollos(nombre, 2, cantidad))
        elif bajo.startswith("paquete pareja"):
            es_paquete = True
            salida.extend(_rollos(nombre, 2, cantidad))
            salida.extend((_linea("Yakimeshi de Pollo o Vegetariano", 2 * cantidad, "cocina"), _linea("Dedo de Queso Gouda", 2 * cantidad, "cocina")))
        elif bajo.startswith("paquete familiar"):
            es_paquete = True
            salida.extend(_rollos(nombre, 4, cantidad))
            salida.extend((_linea("Yakimeshi de Pollo", 2 * cantidad, "cocina"), _linea("Dedo de Queso Philadelphia", 3 * cantidad, "cocina"), _linea("Panchitos Jalapeños con Philadelphia", cantidad, "cocina")))
        elif bajo.startswith("paquete 4"):
            es_paquete = True
            salida.extend((_linea("Furai de Surimi", 2 * cantidad, "sushi"), _linea("California", 2 * cantidad, "sushi")))
        elif bajo.startswith("paquete godín") or bajo.startswith("paquete godin"):
            es_paquete = True
            salida.extend((_linea("Furai de Surimi", cantidad, "sushi"), _linea("Dedo de Queso Gouda", cantidad, "cocina"), _linea("Nestea", cantidad, "bebidas")))
        elif bajo.startswith("mandala box"):
            es_paquete = True
            salida.extend((_linea("California", cantidad, "sushi"), _linea("Kiroi Pollito", cantidad, "sushi"), _linea("Furai de Arrachera", cantidad, "sushi"), _linea("Papas a la Francesa", cantidad, "cocina"), _linea("Tiras de Pollo", 4 * cantidad, "cocina"), _linea("Onigiri de Philadelphia Empanizado", 4 * cantidad, "cocina"), _linea("Rollito Primavera", cantidad, "cocina")))
        else:
            salida.append(dict(item))
        if es_paquete:
            paquete = nombre.split(" · ", 1)[0]
            for linea in salida[inicio:]:
                linea["paquete"] = paquete
    return salida
