---
name: cotizacion-creador
description: Genera la propuesta/cotización en PDF (1 página A4, estilo amarillo) de Nicolas Eichhorn para agencias y marcas. Úsala cuando pidan cotizar acciones (Reel, TikTok, pauta, grabación en campus, etc.) en soles, por separado o en opciones.
---

# Cotización creador (Nico)

1. Copia `ejemplos/zegel-tiktok.json`, ajusta cliente, descripción, `items` y `columnas`.
   - Una columna (`["Precio"]`) = acciones cotizadas por separado.
   - Dos columnas (`["Opción 1","Opción 2"]`) = comparativo; usa `0` donde un ítem no aplica.
2. Genera: `NODE_PATH=$(npm root -g) node generar.js tu.json salida.pdf`
3. Revisa el PDF antes de enviarlo.

## Tarifas de referencia (soles, sin IGV)
| Concepto | Precio |
|---|---|
| Reel collab (guion, grabación, edición, entrega) | 2.306 |
| Réplica en TikTok (adaptación del Reel) | 410 |
| TikTok nativo (referencial, ≈ Reel × 18,4K/49,8K) | 850 |
| 1 mes de pauta | 1.107 |
| Grabación en campus (hasta 2 h 30 min) | 461 |

Condiciones fijas: sin competencia 3 meses, pago a 45 días desde factura, perfil factura, contenido orgánico con lineamientos de la marca.
