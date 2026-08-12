# -*- coding: utf-8 -*-
"""Desglosa paquetes en productos de producción sin modificar la cuenta."""


def _linea(nombre, cantidad=1):
    return {"cantidad": int(cantidad), "nombre": nombre, "total_linea": 0.0}


def _selecciones(nombre):
    if " · " not in nombre:
        return []
    return [x.strip() for x in nombre.split(" · ", 1)[1].split(" + ") if x.strip()]


def _rollos(nombre, esperados, cantidad_paquete):
    elegidos = _selecciones(nombre)
    lineas = [_linea(rollo, cantidad_paquete) for rollo in elegidos]
    if len(elegidos) != esperados:
        lineas.append(_linea("ATENCION: ROLLOS DEL PAQUETE NO ESPECIFICADOS", cantidad_paquete))
    return lineas


def expandir_items(items, marca="mandala"):
    salida = []
    for item in items or []:
        nombre = str(item.get("nombre") or item.get("name") or "").strip()
        cantidad = int(item.get("cantidad") or item.get("qty") or 1)
        bajo = nombre.lower()
        if bajo.startswith("2 rollos x $169"):
            salida.extend(_rollos(nombre, 2, cantidad))
        elif bajo.startswith("paquete pareja"):
            salida.extend(_rollos(nombre, 2, cantidad))
            salida.extend((_linea("Yakimeshi de Pollo o Vegetariano", 2 * cantidad), _linea("Dedo de Queso Gouda", 2 * cantidad)))
        elif bajo.startswith("paquete familiar"):
            salida.extend(_rollos(nombre, 4, cantidad))
            salida.extend((_linea("Yakimeshi de Pollo", 2 * cantidad), _linea("Dedo de Queso Philadelphia", 3 * cantidad), _linea("Panchitos Jalapeños con Philadelphia", cantidad)))
        elif bajo.startswith("paquete 4"):
            salida.extend((_linea("Furai de Surimi", 2 * cantidad), _linea("California", 2 * cantidad)))
        elif bajo.startswith("paquete godín") or bajo.startswith("paquete godin"):
            salida.extend((_linea("Furai de Surimi", cantidad), _linea("Dedo de Queso Gouda", cantidad), _linea("Nestea", cantidad)))
        elif bajo.startswith("mandala box"):
            salida.extend((_linea("California", cantidad), _linea("Kiroi Pollito", cantidad), _linea("Furai de Arrachera", cantidad), _linea("Papas a la Francesa", cantidad), _linea("Tiras de Pollo", 4 * cantidad), _linea("Onigiri de Philadelphia Empanizado", 4 * cantidad), _linea("Rollito Primavera", cantidad)))
        else:
            salida.append(dict(item))
    return salida
