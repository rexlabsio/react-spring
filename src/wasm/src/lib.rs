#![feature(proc_macro, wasm_custom_section, wasm_import_module)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn tension_from_origami_value(o_value: f64) -> f64 {
    (o_value - 30.0) * 3.62 + 194.0
}

#[wasm_bindgen]
pub fn friction_from_origami_value(o_value: f64) -> f64 {
    (o_value - 8.8) * 3.0 + 25.0
}

#[wasm_bindgen]
pub fn calc_acceleration(tension: f64, to: f64, temp_pos: f64, friction: f64, temp_vel: f64) -> f64 {
    tension * (to - temp_pos) - friction * temp_vel
}

#[wasm_bindgen]
pub fn calc_temp(x: f64, y: f64, step: f64) -> f64 {
    x + y * step / 2.0
}
