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

#[wasm_bindgen]
pub struct PosVel {
    pos: f64,
    vel: f64
}

#[wasm_bindgen]
impl PosVel {
    pub fn new() -> PosVel {
        PosVel { pos: 0.0, vel: 0.0 }
    }

    pub fn rk4(&mut self, last_position: f64, last_velocity: f64, num_steps: u32, friction: f64, tension: f64, to: f64) {
        let TIMESTE_p_MSEC = 1.0;
        let step = TIMESTE_p_MSEC / 1000.0;

        let mut position = last_position;
        let mut velocity = last_velocity;
        let mut temp_position = last_position;
        let mut temp_velocity = last_velocity;

        for x in 0..num_steps {
            let a_velocity = velocity;
            let a_acceleration = tension * (to - temp_position) - friction * temp_velocity;
            temp_position = position + a_velocity * step / 2.0;
            temp_velocity = velocity + a_acceleration * step / 2.0;

            let b_velocity = temp_velocity;
            let b_acceleration = tension * (to - temp_position) - friction * temp_velocity;
            temp_position = position + b_velocity * step / 2.0;
            temp_velocity = velocity + b_acceleration * step / 2.0;

            let c_velocity = temp_velocity;
            let c_acceleration = tension * (to - temp_position) - friction * temp_velocity;
            temp_position = position + c_velocity * step / 2.0;
            temp_velocity = velocity + c_acceleration * step / 2.0;

            let d_velocity = temp_velocity;
            let d_acceleration = tension * (to - temp_position) - friction * temp_velocity;
            temp_position = position + c_velocity * step / 2.0;
            temp_velocity = velocity + c_acceleration * step / 2.0;

            let dxdt = (a_velocity + 2.0 * (b_velocity + c_velocity) + d_velocity) / 6.0;
            let dvdt = (a_acceleration + 2.0 * (b_acceleration + c_acceleration) + d_acceleration) / 6.0;
            
            position += dxdt * step;
            velocity += dvdt * step;

            self.pos = position;
            self.vel = velocity;
        }
    }

    // pub fn rk4(&mut self, last_position: f64, last_velocity: f64, friction: f64, tension: f64, to: f64) {
    //     let TIMESTE_p_MSEC = 1.0;
    //     let step = TIMESTE_p_MSEC / 1000.0;

    //     let mut position = last_position;
    //     let mut velocity = last_velocity;
    //     let mut temp_position = last_position;
    //     let mut temp_velocity = last_velocity;

        
    //     let a_velocity = velocity;
    //     let a_acceleration = tension * (to - temp_position) - friction * temp_velocity;
    //     temp_position = position + a_velocity * step / 2.0;
    //     temp_velocity = velocity + a_acceleration * step / 2.0;

    //     let b_velocity = temp_velocity;
    //     let b_acceleration = tension * (to - temp_position) - friction * temp_velocity;
    //     temp_position = position + b_velocity * step / 2.0;
    //     temp_velocity = velocity + b_acceleration * step / 2.0;

    //     let c_velocity = temp_velocity;
    //     let c_acceleration = tension * (to - temp_position) - friction * temp_velocity;
    //     temp_position = position + c_velocity * step / 2.0;
    //     temp_velocity = velocity + c_acceleration * step / 2.0;

    //     let d_velocity = temp_velocity;
    //     let d_acceleration = tension * (to - temp_position) - friction * temp_velocity;
    //     temp_position = position + c_velocity * step / 2.0;
    //     temp_velocity = velocity + c_acceleration * step / 2.0;

    //     let dxdt = (a_velocity + 2.0 * (b_velocity + c_velocity) + d_velocity) / 6.0;
    //     let dvdt = (a_acceleration + 2.0 * (b_acceleration + c_acceleration) + d_acceleration) / 6.0;
        
    //     position += dxdt * step;
    //     velocity += dvdt * step;

    //     self.pos = position;
    //     self.vel = velocity;
    
    // }


    pub fn get_pos(&mut self) -> f64 {
        self.pos
    }

    pub fn get_vel(&mut self) -> f64 {
        self.vel
    }
}


// Strings can both be passed in and received
#[wasm_bindgen]
pub fn concat(a: &str, b: &str) -> String {
    let mut a = a.to_string();
    a.push_str(b);
    return a
}

// A struct will show up as a class on the JS side of things
#[wasm_bindgen]
pub struct Foo {
    contents: u32,
}

#[wasm_bindgen]
impl Foo {
    pub fn new() -> Foo {
        Foo { contents: 0 }
    }

    // Methods can be defined with `&mut self` or `&self`, and arguments you
    // can pass to a normal free function also all work in methods.
    pub fn add(&mut self, amt: u32) -> u32 {
        self.contents += amt;
        return self.contents
    }
}