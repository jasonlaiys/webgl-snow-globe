window.Main_Scene = window.classes.Main_Scene =
class Main_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,0,80 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        // Snowflake variables
        this.snow_r = 20;
        this.snow_num = 17;
        this.snow_wind = 0;
        this.snow_x = [];
        this.snow_y = [];
        this.snow_z = [];
        this.snow_temp = [];
        this.snow_speed = [];
        this.snow_size = [];
        this.snow_model_transform = [];
        this.snow_dis_y = [];
        this.snow_switch = [];
        this.snow_t = 0;
        this.snow_t2 = [];
        this.snow_first_setup = true;
        this.snow_stop = true;
        this.snow_pause = true;

        // Music variables
        this.music_christmas = new Audio("assets/jingle-bells-music-box.mp3");
        this.music_christmas.loop = true;
        this.music_christmas.volume = 1;
        this.music_christmas_volume = 0.5;
        this.music_control = true;

        // Shapes
        const shapes = { grid_sphere:   new Grid_Sphere( 50, 50 ),
                         skybox:        new Skybox(),
                         TreeCube:      new TreeCube(),
                         TreeTrunk:     new Capped_Cylinder( 15, 15, [[0, 0.33], [0, 1]] ),
                         star:          new Star(),
                         snow:          new Subdivision_Sphere(4),
                         land1:         new Half_Sphere( 50, 50, this.snow_r ),
                         land2:         new Subdivision_Sphere(4),
                         temp1:         new Cylindrical_Tube( 50, 50 ),
                         funda:         new Foundation_Cylinder( 100, 100, this.snow_r ),
                         gift:          new Cube(),
                         ball_1:        new Subdivision_Sphere(4),
                       }

        this.submit_shapes( context, shapes );
        
        // Environment texture
        this.environment = [ "assets/1.png", "assets/2.png",  // positive x, negative x
                             "assets/3.png", "assets/4.png",  // positive y, negative y 
                             "assets/5.png", "assets/6.png",  // positive z, negative z
                           ];
        
        // Materials                          
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 0.314, 0.784, 0.471, 1 ), { ambient: 1 } ),

            // Skybox material
            skybox:   context.get_instance( Skybox_Shader ).material( "", {
                              texture: this.environment
                            } ),

            // Glass material
            glass:    context.get_instance( Glass_Shader ).material( "", {
                              texture: this.environment
                            } ),

            // Tree materials
            green:    context.get_instance( Phong_Shader ).material( Color.of( 0, 0.8, 0.5, 1 ), {
                              ambient: .4,
                              diffusivity: .4,
                              specular: .6,
                            } ),  

            brown:    context.get_instance( Phong_Shader ).material( Color.of( 0, 0, 0, 1 ), {
                              ambient: 1,
                              texture: context.get_instance( "assets/trunk2.png", true ),
                            } ), 

            yellow:   context.get_instance( Phong_Shader ).material( Color.of( 1.6, 1.4, 0, 1 ), {
                              ambient: 0.5,
                              diffusivity: 1,
                              specular: 1,
                            } ),     

            // Snow materials
            snow:     context.get_instance( Phong_Shader ).material( Color.of( 255, 250, 250, 1 ), {
                              ambient: 1,
                            } ),

            // Snow globe foundation materials
            land1:    context.get_instance( Phong_Shader ).material( Color.of( 255, 250, 250, 1 ), {
                              ambient: 1,
                            } ),

            land2:    context.get_instance( Phong_Shader ).material( Color.of( 1, 0, 0, 0.1 ), {
                              ambient: 1,
                            } ),

            base:     context.get_instance( Texture_Foundation ).material( Color.of( 0, 0, 0, 1 ), {
                              ambient: 1,
                              texture: context.get_instance( "assets/foundation3.png", true ),
                            } ),

            // Gift materials
            gift1:     context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0, 1), {
                               ambient: 1,
                               texture: context.get_instance("assets/gift_1.png"),
                            } ),

            gift2:     context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0, 1), {
                               ambient: 1,
                               texture: context.get_instance("assets/gift_2.png"),
                            } ),

            gift3:     context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0, 1), {
                               ambient: 1,
                               texture: context.get_instance("assets/gift_3.png"),
                            } ),

            gift4:     context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0, 1), {
                               ambient: 1,
                               texture: context.get_instance("assets/gift_8.png"),
                            } ),

            gift5:     context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0, 1), {
                               ambient: 1,
                               texture: context.get_instance("assets/gift_5.png"),
                            } ),

            gift6:     context.get_instance( Phong_Shader ).material( Color.of(0, 0, 0, 1), {
                               ambient: 1,
                               texture: context.get_instance("assets/gift_6.png"),
                            } ),

            // Ball materials
            yellow1:   context.get_instance(Phong_Shader).material(Color.of(1.6, 1.4, 0.3, 1), {
                               ambient: .9,
                               diffusivity: 1,
                               specular: 1,
                            } ),

            red:       context.get_instance(Phong_Shader).material(Color.of(1.5, 0, 0.2, 1), {
                               ambient: .5,
                               diffusivity: 1,
                               specular: 1,
                            } ),

            blue:      context.get_instance(Phong_Shader).material(Color.of(0.675, 1.03, 1.175, 1), {
                               ambient: .8,
                               diffusivity: 1,
                               specular: 1,
                            } ),

            white:     context.get_instance(Phong_Shader).material(Color.of(1, 1, 1, 1), {
                               ambient: .5,
                               diffusivity: 1,
                               specular: 1,
                            } ),

            purple:    context.get_instance(Phong_Shader).material(Color.of(1.275,0.96,1.015,1), {
                               ambient: .7,
                               diffusivity: 1,
                               specular: 1,
                            } ),
           };

        this.lights = [ new Light( Vec.of( 0, 0, 40, 1 ), Color.of( 1, 1, 1, 1 ), 100000 ) ];

      }

    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    {
      this.key_triggered_button( "Pause snow", [ "1" ], () => {
        this.snow_pause = !this.snow_pause;
      } );
      this.key_triggered_button( "Stop/Start the snow animation", [ "2" ], () => {
        this.snow_stop = !this.snow_stop;
      } ); 

      this.new_line();

      this.key_triggered_button( "Increase the snow's speed", [ "3" ], () => this.change_snow_speed(1) );
      this.key_triggered_button( "Decrease the snow's speed", [ "4" ], () => this.change_snow_speed(-1));

      this.new_line();
      
      this.key_triggered_button( "Snow Wind+", [ "5" ], () => this.snow_wind += 0.1 );
      this.key_triggered_button( "Snow Wind-", [ "6" ], () => this.snow_wind -= 0.1 ); this.new_line();

      this.key_triggered_button( "Play/Pause the music", [ "7" ], () => this.music_control = !this.music_control );
    }

    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const t = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;
        let sphere_scale = 20;

        // Play Music
        if ( !this.music_control )
          this.music_christmas.play();

        else if ( this.music_control )
          this.music_christmas.pause();
      
        // Draw skybox
        this.shapes.skybox.draw( graphics_state, Mat4.identity(), this.materials.skybox );

        // Draw glass sphere
        this.shapes.grid_sphere.draw( graphics_state, Mat4.scale( Vec.of( sphere_scale, sphere_scale, sphere_scale ) ), this.materials.glass );

        // Draw tree
        let tree_pos_shift = Mat4.translation( Vec.of( 0, -15, 0 ) );
        this.draw_tree( graphics_state, tree_pos_shift );
        this.draw_star( graphics_state, tree_pos_shift, t, dt );
        this.draw_gift(graphics_state,tree_pos_shift,t,dt);
        this.draw_ball(graphics_state,tree_pos_shift,t,dt);

        // Draw snow
        this.draw_snow_animation( graphics_state, dt, this.snow_r, this.snow_num );

        // Camera animation throughout
        let camera_pos = Vec.of( 80 * Math.cos( t / 4 ), 0, - 80 * Math.sin( t / 4 ) );
        let center_interest = Vec.of( 0, 0, 0 );
        let up = Vec.of( 0, 1, 0 );
        let camera_matrix = Mat4.look_at( camera_pos, center_interest, up );
        graphics_state.camera_transform = camera_matrix.map( (x, i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, 1 ) );

      }

    // ================================= HELPER FUNCTIONS =================================
    
    draw_tree( graphics_state, transform ) {

      let modelTransform_1 = Mat4.identity();
      let scale = Mat4.scale( [8, 3, 8] );
      modelTransform_1 = modelTransform_1.times(scale);

      for(let i = 0; i < 5; i++) {
        let translate = Mat4.translation( [0, 2, 0] );
        let scale1 = Mat4.scale( [0.8 + i / 100, 0.8 + i / 100, 0.8 + i / 100] );
        let rotate = Mat4.rotation( Math.PI / 8, Vec.of( 0, 1, 0 ) );
        modelTransform_1 = modelTransform_1.times(translate).times(scale1).times(rotate);
        this.shapes.TreeCube.draw( graphics_state, transform.times( modelTransform_1 ), this.materials.green );
      }
      
      let trunk_scale = Mat4.scale( Vec.of( 1.5, 1.5, 10 ));
      let trunk_rotate = Mat4.rotation( Math.PI / 2, Vec.of( 1, 0, 0 ) );
      let trunk_translate = Mat4.translation( Vec.of( 0, -10, 0 ) );
      let trunk_transform = trunk_translate.times( trunk_rotate ).times( trunk_scale );
      this.shapes.TreeTrunk.draw( graphics_state, trunk_transform, this.materials.brown );
        
    }

    draw_star( graphics_state, transform, t, dt ) {
      let model_transform_3 = transform;
      let scale3 = Mat4.scale([0.45, 0.45, 0.45]);
      let translation3 = Mat4.translation(Vec.of(0, 27.5, 0));
      model_transform_3 = model_transform_3.times(translation3).times(scale3);
      this.shapes.star.draw( graphics_state, model_transform_3, this.materials.yellow );
    }

    draw_gift(graphics_state) {
      //draw gift
      let model_transform = Mat4.identity();
      let lowTranslation = Mat4.translation([0, -12.5, 0]);
      let firstScale = Mat4.scale([0.75,0.75,0.75]);
      model_transform = model_transform.times(lowTranslation).times(firstScale);
      let model_transform_4 = model_transform;
      let scale4 = Mat4.scale([1.5, 1.5, 1.5]);
      let translation4 = Mat4.translation([2, 1, 0]);
      let rotate4 = Mat4.rotation(Math.PI / 5, Vec.of(0, 1, 0));
      model_transform_4 = model_transform_4.times(translation4).times(scale4).times(rotate4);
      let model_transform_5 = model_transform_4;

      let scale5 = Mat4.scale([1, 2, 1]);
      let translation5 = Mat4.translation([2.8, 0, 0.5]);
      let rotate5 = Mat4.rotation(Math.PI / 3, Vec.of(0, 1, 0));
      model_transform_5 = model_transform_4.times(translation5).times(scale5).times(rotate5);
      this.shapes.gift.draw(graphics_state, model_transform_5, this.materials.gift1);

      let model_transform_10 = model_transform;
      let scale10 = Mat4.scale([2.5, 0.8, 1.5]);
      let translation10 = Mat4.translation([2, -1, -4.5]);
      let rotate10 = Mat4.rotation(Math.PI / 4, Vec.of(0, -1, 0));
      model_transform_10 = model_transform_4.times(translation10).times(rotate10).times(scale10);
      this.shapes.gift.draw(graphics_state, model_transform_10, this.materials.gift2);


      let model_transform_8 = model_transform;
      let scale8 = Mat4.scale([1.5, 2.7, 1.5]);
      let translation8 = Mat4.translation([-6, 1, -3]);
      let rotate8 = Mat4.rotation(Math.PI / 5, Vec.of(0, -1, 0));
      model_transform_8 = model_transform_8.times(translation8).times(scale8).times(rotate8);
      this.shapes.gift.draw(graphics_state, model_transform_8, this.materials.gift3);

      let model_transform_9 = model_transform;
      let scale9 = Mat4.scale([1.3, 1.3, 1.3]);
      let translation9 = Mat4.translation([-5.5, -0.6, -2]);
      let rotate9 = Mat4.rotation(Math.PI / 5, Vec.of(0, 1, 0));
      model_transform_9 = model_transform_4.times(translation9).times(rotate9).times(scale9);
      this.shapes.gift.draw(graphics_state, model_transform_9, this.materials.gift4);

      let model_transform_7 = model_transform_4;
      let scale7 = Mat4.scale([1, 0.5, 2]);
      let translation7 = Mat4.translation([-4, -1.2, 3]);
      let rotate7 = Mat4.rotation(0, Vec.of(0, 1, 0));
      model_transform_7 = model_transform_4.times(translation7).times(rotate7).times(scale7);
      this.shapes.gift.draw(graphics_state, model_transform_7, this.materials.gift5);

      let model_transform_11 = model_transform;
      let scale11 = Mat4.scale([1, 0.9, 1.2]);
      let translation11 = Mat4.translation([9, -0.1, -0.5]);
      let rotate11 = Mat4.rotation(Math.PI / 5, Vec.of(0, -1, 0));
      model_transform_11 = model_transform_8.times(translation11).times(rotate11).times(scale11);
      this.shapes.gift.draw(graphics_state, model_transform_11, this.materials.gift6);

    }

    draw_ball( graphics_state, model_transform)
    {
      let model_transform_original = Mat4.identity();
      let translation_original = Mat4.translation([0,-15,0]);
      let scale_original = Mat4.scale([0.7,0.7,0.7]);
      model_transform_original = model_transform_original.times(translation_original).times(scale_original);
      
      //level 1
      
      let translation_1 = Mat4.translation([5.8,7.8,13.8]);
      let model_transform_1 = model_transform_original.times(translation_1);
      this.shapes.ball_1.draw(graphics_state, model_transform_1, this.materials.yellow1 );

      let translation_2 = Mat4.translation([-9.2,7.8,11.9]);
      let model_transform_2 = model_transform_original.times(translation_2);
      this.shapes.ball_1.draw(graphics_state, model_transform_2, this.materials.red );

      let translation_3 = Mat4.translation([-14.8,7.8,-1.9]);
      let model_transform_3 = model_transform_original.times(translation_3);
      this.shapes.ball_1.draw(graphics_state, model_transform_3, this.materials.blue );

      let translation_4 = Mat4.translation([-5.7,7.8,-13.8]);
      let model_transform_4 = model_transform_original.times(translation_4);
      this.shapes.ball_1.draw(graphics_state, model_transform_4, this.materials.purple );

      let translation_5 = Mat4.translation([9.1,7.8,-11.9]);
      let model_transform_5 = model_transform_original.times(translation_5);
      this.shapes.ball_1.draw(graphics_state, model_transform_5, this.materials.yellow1 );

      let translation_6 = Mat4.translation([14.9,7.8,1.9]);
      let model_transform_6 = model_transform_original.times(translation_6);
      this.shapes.ball_1.draw(graphics_state, model_transform_6, this.materials.red );

      // level 2
      
      let translation_7 = Mat4.translation([8.5,14.7,8.5]);
      let model_transform_7 = model_transform_original.times(translation_7);
      this.shapes.ball_1.draw(graphics_state, model_transform_7, this.materials.blue );

      let translation_8 = Mat4.translation([11.6,14.7,-3.2]);
      let model_transform_8 = model_transform_original.times(translation_8);
      this.shapes.ball_1.draw(graphics_state, model_transform_8, this.materials.purple );

      let translation_9 = Mat4.translation([3.2,14.7,-11.6]);
      let model_transform_9 = model_transform_original.times(translation_9);
      this.shapes.ball_1.draw(graphics_state, model_transform_9, this.materials.red );

      let translation_10 = Mat4.translation([-8.4,14.7,-8.5]);
      let model_transform_10 = model_transform_original.times(translation_10);
      this.shapes.ball_1.draw(graphics_state, model_transform_10, this.materials.yellow1 );

      let translation_11 = Mat4.translation([-11.6,14.7,3.1]);
      let model_transform_11 = model_transform_original.times(translation_11);
      this.shapes.ball_1.draw(graphics_state, model_transform_11, this.materials.purple );

      let translation_12 = Mat4.translation([-3.1,14.7,11.6]);
      let model_transform_12 = model_transform_original.times(translation_12);
      this.shapes.ball_1.draw(graphics_state, model_transform_12, this.materials.red );

      // level 3

      let translation_13 = Mat4.translation([9.0,20.1,3.7]);
      let model_transform_13 = model_transform_original.times(translation_13);
      this.shapes.ball_1.draw(graphics_state, model_transform_13, this.materials.purple );

      let translation_14 = Mat4.translation([7.7,20.1,-6]);
      let model_transform_14 = model_transform_original.times(translation_14);
      this.shapes.ball_1.draw(graphics_state, model_transform_14, this.materials.blue );

      let translation_15 = Mat4.translation([-1.3,20.1,-9.6]);
      let model_transform_15 = model_transform_original.times(translation_15);
      this.shapes.ball_1.draw(graphics_state, model_transform_15, this.materials.yellow1 );

      let translation_16 = Mat4.translation([-9,20.1,-3.8]);
      let model_transform_16 = model_transform_original.times(translation_16);
      this.shapes.ball_1.draw(graphics_state, model_transform_16, this.materials.red );

      let translation_17 = Mat4.translation([-7.7,20.1,5.9]);
      let model_transform_17 = model_transform_original.times(translation_17);
      this.shapes.ball_1.draw(graphics_state, model_transform_17, this.materials.blue );

      let translation_18 = Mat4.translation([1.2,20.1,9.6]);
      let model_transform_18 = model_transform_original.times(translation_18);
      this.shapes.ball_1.draw(graphics_state, model_transform_18, this.materials.yellow1 );

      // level 4

      let translation_19 = Mat4.translation([8.,24.65,0]);
      let model_transform_19 = model_transform_original.times(translation_19);
      this.shapes.ball_1.draw(graphics_state, model_transform_19, this.materials.yellow1 );

      let translation_20 = Mat4.translation([4,24.65,-6.9]);
      let model_transform_20 = model_transform_original.times(translation_20);
      this.shapes.ball_1.draw(graphics_state, model_transform_20, this.materials.purple );

      let translation_21 = Mat4.translation([-4,24.65,-6.9]);
      let model_transform_21 = model_transform_original.times(translation_21);
      this.shapes.ball_1.draw(graphics_state, model_transform_21, this.materials.blue );

      let translation_22 = Mat4.translation([-8,24.65,0]);
      let model_transform_22 = model_transform_original.times(translation_22);
      this.shapes.ball_1.draw(graphics_state, model_transform_22, this.materials.yellow1 );

      let translation_23 = Mat4.translation([-4,24.65,6.9]);
      let model_transform_23 = model_transform_original.times(translation_23);
      this.shapes.ball_1.draw(graphics_state, model_transform_23, this.materials.purple );

      let translation_24 = Mat4.translation([4,24.65,6.9]);
      let model_transform_24 = model_transform_original.times(translation_24);
      this.shapes.ball_1.draw(graphics_state, model_transform_24, this.materials.red );

      // level 5

      let translation_25 = Mat4.translation([-0.9,28.4,6.5]);
      let model_transform_25 = model_transform_original.times(translation_25);

      let translation_26 = Mat4.translation([5.1,28.4,4.0]);
      let model_transform_26 = model_transform_original.times(translation_26);
      this.shapes.ball_1.draw(graphics_state, model_transform_26, this.materials.blue );

      let translation_27 = Mat4.translation([6.1,28.4,-2.6]);
      let model_transform_27 = model_transform_original.times(translation_27);

      let translation_28 = Mat4.translation([0.9,28.4,-6.5]);
      let model_transform_28 = model_transform_original.times(translation_28);
      this.shapes.ball_1.draw(graphics_state, model_transform_28, this.materials.red );

      let translation_29 = Mat4.translation([-5.2,28.4,-4.1]);
      let model_transform_29 = model_transform_original.times(translation_29);

      let translation_30 = Mat4.translation([-6.1,28.4,2.5]);
      let model_transform_30 = model_transform_original.times(translation_30);
      this.shapes.ball_1.draw(graphics_state, model_transform_30, this.materials.blue );
    }

    basic_setup(r, num) {
      for (let i = 0; i < this.snow_num; i++) {
        this.snow_x[i] = [];
        this.snow_y[i] = [];
        this.snow_z[i] = [];
        this.snow_temp[i] = [];
        this.snow_speed[i] = [];
        this.snow_size[i] = [];
        this.snow_model_transform[i] = [];
        this.snow_dis_y[i] = [];
        this.snow_t2[i] = [];
        this.snow_switch[i] = [];
        let ini_pos_x = -r;
        let ini_pos_y = 2 * r;
        let ini_pos_z = -r;

        for (let j = 0; j < this.snow_num; j++) {
          this.snow_x[i].push(ini_pos_x + (Math.random() + i) * 2 * (r) / num);
          this.snow_y[i].push(ini_pos_y * (1 - Math.random()));
          this.snow_z[i].push(ini_pos_z + (Math.random() + j) * 2 * (r) / num);
          this.snow_temp[i].push(0);
          this.snow_speed[i].push(-Math.random() * 2 - 4);
          this.snow_size[i].push(0.05 + Math.random() * 0.2);
          this.snow_dis_y[i].push(0);
          this.snow_t2[i].push(0);
          this.snow_switch[i].push(true);
        }
      }
    }

    change_snow_speed(s) {
      for (let i = 0; i < this.snow_num; i++) {
        for (let j = 0; j < this.snow_num; j++) {
          this.snow_y[i][j] = this.snow_dis_y[i][j];
          this.snow_temp[i][j] = 0;
          this.snow_speed[i][j] -= s;
          if (this.snow_speed[i][j] > -0.1)   this.snow_speed[i][j] = -0.1;
        }
      }
      this.snow_t = 0;
    }

    draw_snow_animation(graphics_state, dt, r, num) {
      if (this.snow_first_setup) {
        this.basic_setup(r, num);
        this.snow_first_setup = false;
      }

      for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
          this.snow_dis_y[i][j] = this.snow_y[i][j] + this.snow_speed[i][j] * this.snow_t + this.snow_temp[i][j];

          this.snow_model_transform[i][j] = Mat4.identity()
              .times(Mat4.translation([this.snow_x[i][j] + this.snow_wind * this.snow_t2[i][j], this.snow_dis_y[i][j], this.snow_z[i][j]]))
              .times(Mat4.scale([this.snow_size[i][j], this.snow_size[i][j], this.snow_size[i][j]]));

          if ((Math.pow(this.snow_x[i][j] + this.snow_wind * this.snow_t2[i][j], 2) + Math.pow(this.snow_dis_y[i][j], 2) +
              Math.pow(this.snow_z[i][j], 2) < r * r) & this.snow_switch[i][j])
            this.shapes.snow.draw(graphics_state, this.snow_model_transform[i][j], this.materials.snow);

          if ((this.snow_y[i][j] + this.snow_speed[i][j] * this.snow_t + this.snow_temp[i][j] < -r)) {
            this.snow_temp[i][j] += 2 * r;
            this.snow_t2[i][j] = 0;
            if (!this.snow_stop)
              this.snow_switch[i][j] = false;
            else {
              this.snow_switch[i][j] = true;
            }
          }

          if (this.snow_pause) {
            this.snow_t2[i][j] += dt;
          }
        }
      }
      if (this.snow_pause) {
        this.snow_t += dt;
      }

      this.shapes.land1.draw(graphics_state, Mat4.identity().times(Mat4.rotation(1/2*Math.PI, Vec.of(-1, 0, 0))), this.materials.land1);
      this.shapes.land2.draw(graphics_state, Mat4.identity().times(Mat4.scale([this.snow_r / 2 * Math.pow(2, 1/2), 0.0001, this.snow_r / 2 * Math.pow(2, 1/2)]))
                                                            .times(Mat4.translation([0, -this.snow_r * 5000 * Math.pow(2, 1/2), 0])), this.materials.land1);
      this.shapes.funda.draw( graphics_state, Mat4.identity().times(Mat4.rotation(Math.PI/2, Vec.of(1, 0, 0))), this.materials.base );
    }
  }




// ======================================================== CUSTOM SHAPES ========================================================

window.Skybox = window.classes.Skybox =
class Skybox extends Shape {
  constructor() {
    super( "positions", "texture_coords" );

    let max = 0.9999;
    let min = -0.9999;

    this.positions.push( ...Vec.cast( [min, min, max], [max, min, max], [min, max, max], [max, max, max] ) );
    this.texture_coords.push( ...Vec.cast( [0, 0], [1, 0], [0, 1], [1, 1] ) );
    this.indices.push( 0, 1, 2,   1, 3, 2 );    
  }
}

window.TreeCube = window.classes.TreeCube =
class TreeCube extends Shape { 
  constructor() {
    super( "positions", "normals" );
    this.positions.push(...Vec.cast(
        [0,0,Math.sqrt(3)], [1.5, 0, Math.sqrt(3)/2], [1.5, 0, -Math.sqrt(3)/2],
        [0,0,-Math.sqrt(3)], [-1.5, 0, -Math.sqrt(3)/2], [-1.5, 0, Math.sqrt(3)/2],[0,5,0]));
    this.normals.push(...Vec.cast(

        //[0,0,-1], [0,0,-1], [0,0,-1], [0,-1,0], [0,-1,0], [0,-1,0], [-1,0,0]
        [0,0,1], [-1,0,1], [0,1,0], [-1,0,0 ], [0,0,-1], [0,-1,0], [0,-1,0] ));

    //this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1,], [1, 1]));
    this.indices.push(0,4,2,  5,3,1,
        6,2,0, 6,4,2,  6,0,4,  6,1,5, 6,3,1, 6,5,3);
  }
}

window.Half_Sphere = window.classes.Half_Sphere =
class Half_Sphere extends Shape { 
  constructor( rows, columns, r, texture_range ) {          // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
    super( "positions", "normals", "texture_coords" );

    const circle_points = Array( rows ).fill( Vec.of(0, -r/2 *0.98 * Math.pow(2, 1/2), -r/2 * .98 * Math.pow(2, 1/2)) )
                                       .map( (p,i,a) => Mat4.rotation( i/(a.length-1) * 1 / 2 * Math.PI, Vec.of( 1,0,0 ) )
                                       .times( p.to4(1) ).to3() );

    Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] );
  } 
}

window.Foundation_Cylinder = window.classes.Foundation_Cylinder =
class Foundation_Cylinder extends Shape { 
  constructor( rows, columns, r, texture_range) {           // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
    super( "positions", "normals", "texture_coords" );

    let y = r/2 * Math.pow(2, 1/2) * .99;
    let z = r/2 * Math.pow(2, 1/2) * .99;
    const c1 = Array( rows ).fill( Vec.of(0, -y, z))
        .map( (p,i,a) => Mat4.translation( [0, i/(a.length-1) * -r * .4, i/(a.length-1) * r *.4])
            .times( p.to4(1) ).to3() );

    Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, c1 ] );

    const c2 = Array( rows ).fill( Vec.of(0, -y - r * .4, z + r * .4 ))
        .map( (p,i,a) => Mat4.translation( [0, i/(a.length-1) * (y + r * .4), 0])
            .times( p.to4(1) ).to3() );

    Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, c2 ] );
  } 
}

window.Star = window.classes.Star =
class Star extends Shape {
  constructor() {
    super("positions", "normals");
    this.positions.push(...Vec.cast([0, 5.0, 0], [1.2, 1.2, 0], [5.0, 1.2, 0], [1.8, -1.1, 0],
        [3.0, -5.0, 0], [0, -2.5, 0], [-3.0, -5.0, 0], [-1.8, -1.1, 0],
        [-5.0, 1.2, 0], [-1.2, 1.2, 0], [0, 0, 1.5], [0, 0, -1.5]));
    this.normals.push(...Vec.cast([0, -1, 0], [0, -1, 0], [0, -1, 0], [0, -1, 0],
        [0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0],
        [-1, 0, 0], [-1, 0, 0], [-1, 0, 0], [-1, 0, 0]));
    this.indices.push(0, 3, 6, 0, 7, 4, 8, 5, 2,
        9, 10, 0, 0, 10, 1, 1, 10, 2, 2, 10, 3, 4, 3, 10, 4, 10, 5,
        6, 5, 10, 6, 10, 7, 7, 10, 8, 8, 10, 9, 9, 10, 0,

        9, 0, 11, 0, 1, 11, 1, 2, 11, 2, 3, 11, 4, 11, 3, 4, 5, 11,
        6, 5, 11, 6, 7, 11, 7, 8, 11, 8, 9, 11, 9, 0, 11,);
  }
}

// ======================================================== CUSTOM SHADERS ========================================================

/*
This shader applies a texture cube that represents the environment to the "far" plane in viewport coordinates.
Thus, this shader ignores the model_transform matrix, as it assumes the positions of each vertex of the shape 
is defined in viewport coordinates.
This shader uses the inverse projection camera matrix to map a position on the texture cube to a position on
screen.
The vertex shader assumes that the shapes' vertices are given in screen space coordinates.

Code in this shader class has been referenced (but not outright copied) from multiple sources.
We used the steps in the following links and our understanding of how tiny-graphics.js interacts with WebGL
to produce this shader.
Sources used are linked below.

References:
Environment mapping: https://webglfundamentals.org/webgl/lessons/webgl-environment-maps.html
*/
window.Skybox_Shader = window.classes.Skybox_Shader =
class Skybox_Shader extends Shader {

  material( color, properties ) {
    return new class Material {
      constructor( shader, color = "#000000" ) {
        Object.assign( this, { shader, color } );
        Object.assign( this, properties );
      }
    }( this, color );
  }

  map_attribute_name_to_buffer_name( name ) { 
    return { object_space_pos: "positions", tex_coord: "texture_coords" }[ name ]; 
  }

  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl ) { 

    const proj_camera = g_state.projection_transform.times( g_state.camera_transform );

    var temp = g_state.camera_transform.times( Mat4.identity() );
    temp[0][3] = 0;
    temp[1][3] = 0;
    temp[2][3] = 0;
    let proj_camera_inverse = Mat4.inverse( g_state.projection_transform.times( temp ) );

    let inverse_camera = Mat4.inverse( g_state.camera_transform );
                                                                                    // Send our matrices to the shader programs:
    gl.uniformMatrix4fv( gpu.inverse_camera_transform_loc,                  false, Mat.flatten_2D_to_1D(      inverse_camera.transposed() ) );
    gl.uniformMatrix4fv( gpu.inverse_projection_camera_transform_loc,       false, Mat.flatten_2D_to_1D( proj_camera_inverse.transposed() ) );
    
    // Disables back-face culling
    gl.disable(gl.CULL_FACE);

    // Create texture cube
    var tex = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_CUBE_MAP, tex );

    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    
    // Prioritizes texture over color
    if (material.texture) {
      const faces = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: material.texture[0] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: material.texture[1] },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: material.texture[2] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: material.texture[3] },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: material.texture[4] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: material.texture[5] },
      ];
      
      // Maps each texture to its target face on the texture cube
      faces.forEach( (face) => {
        const { target, url } = face;
        var image = document.createElement("img");
        image.src = url;      
        ctx.drawImage( image, 0, 0 ); // Draws the environment image on a canvas

        gl.texImage2D( target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas ); // Map the canvas content to a texture cube's face
      } );
    }

    else {
      const faces = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z },
      ];

      faces.forEach( (face) => {
        const { target } = face;
        ctx.fillStyle = material.color;
        ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height ); // Colors the canvas with the environment color

        gl.texImage2D( target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas ); // Map the canvas content to a texture cube's face
      } );
    }

    gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );

  }

  shared_glsl_code() {
    return `
      
      precision mediump float;
      varying vec4 position;

    `;
  }

  vertex_glsl_code() {
    return `
      
      attribute vec3 object_space_pos;

      uniform mat4 inverse_projection_camera_transform;
      uniform mat4 inverse_camera_transform;

      void main() {

        position = inverse_projection_camera_transform * vec4( object_space_pos, 1.0 );
        gl_Position = vec4( object_space_pos, 1.0 );

      }

    `;
  }
  
  fragment_glsl_code() {
    return `
      
      uniform samplerCube texture;

      void main() {
        gl_FragColor = textureCube( texture, normalize( position.xyz / position.w ) );
      }

    `;
  }

}

/*
This shader applies reflection and refraction to an object, giving it a glass-like appearance.
This shader does not color objects, instead, it uses maps the environment to the object, providing
a "see through" effect.

Code in this shader class has been referenced (but not outright copied) from multiple sources.
We used the steps in the following links and our understanding of how tiny-graphics.js interacts with WebGL
to produce this shader.
Sources used are linked below.

References:
Environment mapping: https://webglfundamentals.org/webgl/lessons/webgl-environment-maps.html
Shader code: http://ledohm.free.fr/test_webgl/three.fresnel_shader.js
Physics formulas from Wikipedia, links below in shader code
*/
window.Glass_Shader = window.classes.Glass_Shader =
class Glass_Shader extends Shader {
  
  material( color, properties ) {
    return new class Material {
      constructor( shader, color = "#000000" ) {
        Object.assign( this, { shader, color } );
        Object.assign( this, properties );
      }
    }( this, color );
  }

  map_attribute_name_to_buffer_name( name ) { 
    return { object_space_pos: "positions", normal: "normals", tex_coord: "texture_coords" }[ name ]; 
  }

  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl ) { 

    const proj_camera = g_state.projection_transform.times( g_state.camera_transform );

    let pcm_transform = g_state.projection_transform.times( g_state.camera_transform.times( model_transform ) );
    let inverse_camera = Mat4.inverse( g_state.camera_transform );
                                                                                    // Send our matrices to the shader programs:
    gl.uniformMatrix4fv( gpu.model_transform_loc,                           false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
    gl.uniformMatrix4fv( gpu.projection_camera_model_transform_loc,         false, Mat.flatten_2D_to_1D(   pcm_transform.transposed() ) );
    gl.uniformMatrix4fv( gpu.inverse_camera_transform_loc,                  false, Mat.flatten_2D_to_1D(  inverse_camera.transposed() ) );
    
    // Culls face to make glass seem transparent on viewing plane
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
    // Create texture cube
    var tex = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_CUBE_MAP, tex );

    const ctx = document.createElement("canvas").getContext("2d");
    ctx.canvas.width = 256;
    ctx.canvas.height = 256;
    
    // Prioritizes texture over color
    if (material.texture) {
      const faces = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: material.texture[0] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: material.texture[1] },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: material.texture[2] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: material.texture[3] },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: material.texture[4] },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: material.texture[5] },
      ];

      faces.forEach( (face) => {
        const { target, url } = face;
        var image = document.createElement("img");
        image.src = url;      
        ctx.drawImage( image, 0, 0 ); 

        gl.texImage2D( target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas );
      } );
    }

    else {
      const faces = [
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y },
        { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z },
        { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z },
      ];

      faces.forEach( (face) => {
        const { target } = face;
        ctx.fillStyle = material.color;
        ctx.fillRect( 0, 0, ctx.canvas.width, ctx.canvas.height );

        gl.texImage2D( target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ctx.canvas );
      } );
    }

    gl.generateMipmap( gl.TEXTURE_CUBE_MAP );
    gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );

  }

  shared_glsl_code() {
    return `
      
      precision mediump float;
      
      varying vec3 reflection;
      varying vec3 refraction[3];
      varying float fresnel;

    `;
  }

  vertex_glsl_code() {
    return `
      
      attribute vec3 object_space_pos, normal;

      uniform mat4 model_transform;
      uniform mat4 projection_camera_model_transform;
      uniform mat4 inverse_camera_transform;

      const float air = 1.0;          // Refractive index of air
      const float glass = 1.51714;    // Refractive index of glass
      
      const float ratio = air / glass;                                            // Air to glass ratio
      const float reflectivity = pow( (air - glass) / (air + glass), 2.0 );       // Formula from https://en.wikipedia.org/wiki/Refractive_index#Reflectivity
      
      void main() {

        vec4 position = model_transform * vec4( object_space_pos, 1 );
        vec3 incident = normalize( position.xyz - ( inverse_camera_transform * vec4(0, 0, 0, 1) ).xyz );
        
        vec3 N = normalize( mat3( model_transform[0].xyz, model_transform[1].xyz, model_transform[2].xyz ) * normal );

        reflection = normalize( reflect(incident, N) );

        refraction[0] = normalize( refract(incident, N, ratio) );
        refraction[1] = normalize( refract(incident, N, ratio * 0.99) );
        refraction[2] = normalize( refract(incident, N, ratio * 0.98) );

        fresnel = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 + dot(incident, N) ), 5.0 );    // Formula from https://en.wikipedia.org/wiki/Schlick%27s_approximation

        gl_Position = projection_camera_model_transform * vec4( object_space_pos, 1 ); 

      }

    `;
  }

  fragment_glsl_code() {
    return `

      uniform samplerCube texture; 

      void main() {
        
        vec4 reflection_color = textureCube( texture, vec3( -reflection.x, -reflection.yz ) );
        vec4 refraction_color = vec4( 1.0 );

        refraction_color.r = textureCube( texture, vec3( refraction[0].x, refraction[0].yz ) ).r;
        refraction_color.g = textureCube( texture, vec3( refraction[1].x, refraction[1].yz ) ).g;
        refraction_color.b = textureCube( texture, vec3( refraction[2].x, refraction[2].yz ) ).b;

        gl_FragColor = mix( refraction_color, reflection_color, clamp( fresnel, 0.0, 1.0 ) );

      }

    `;
  }
}

/*
This shader overrides Phong_Shader's fragment shader to texture the snow globe base
*/
class Texture_Foundation extends Phong_Shader { 
  fragment_glsl_code() {
    return `

      uniform sampler2D texture;

      void main() { 

        if( GOURAUD || COLOR_NORMALS ) {   // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
          gl_FragColor = VERTEX_COLOR;     // Otherwise, we already have final colors to smear (interpolate) across vertices.            
          return;
        }                                 

        float p_x, p_y;
        float a = pow(2.0, 0.5);
        float b = 0.4;
        float r = 20.0;

        if (p_found.y > 0.0) {
          p_x = p_found.x * 1.0/4.0/(a+b)/r + 0.25;
        }

        else {
          p_x = p_found.x * -1.0/4.0/(a+b)/r + 0.75;
        }

        p_y = p_found.y * 2.5 / r + 2.5 * (a + b) ;

        vec4 tex_color = texture2D( texture, vec2(p_x, p_y));

        if( USE_TEXTURE ) 
          gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 

        else 
          gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );

        gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.

      }

    `;
  }
}
