import test from 'node:test';
import assert from 'node:assert/strict';
import {avatarValues,validAvatar} from '../avatar-options.js';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const original={type:'person',skin:'peach',outfit:'shirt',hat:'none',glasses:'none',outfitColor:'teal'};
test('el contrato conserva los personajes originales y acepta las opciones nuevas',()=>{
  assert.equal(validAvatar(original),true);
  for(const [category,values] of Object.entries(avatarValues)) {
    for(const value of values) assert.equal(validAvatar({...original,[category]:value}),true,`${category}: ${value}`);
  }
  assert.equal(validAvatar({type:'rabbit',skin:'rose',outfit:'stripes',hat:'wizard',glasses:'square',outfitColor:'green'}),true);
});
test('el contrato rechaza opciones desconocidas, propiedades extra y datos incompletos',()=>{
  assert.equal(validAvatar({...original,hat:'desconocido'}),false);
  assert.equal(validAvatar({...original,extra:'x'}),false);
  assert.equal(validAvatar({type:'person'}),false);
  assert.equal(validAvatar(null),false);
  assert.equal(validAvatar([]),false);
});
test('opciones del editor coinciden con el servidor y los nuevos personajes se dibujan',async()=>{
  const vite=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
  try {
    const {characterOptions,Character}=await vite.ssrLoadModule('/src/Character.jsx');
    for(const [category,values] of Object.entries(avatarValues)) assert.deepEqual(characterOptions[category].map(option=>option.id),values);
    for(const type of ['rabbit','dog']) {
      const markup=renderToStaticMarkup(React.createElement(Character,{value:{...original,type,outfit:'stripes',hat:'wizard',glasses:'square'}}));
      assert.match(markup,/<svg/);assert.match(markup,/aria-label="Personaje/);assert.match(markup,/<rect/);
    }
    const pair=renderToStaticMarkup(React.createElement('div',null,
      React.createElement(Character,{value:{...original,skin:'peach',outfitColor:'red'}}),
      React.createElement(Character,{value:{...original,skin:'mint',outfitColor:'green'}})));
    const ids=[...pair.matchAll(/<radialGradient id="([^"]+)"/g)].map(match=>match[1]);
    assert.equal(ids.length,2);assert.notEqual(ids[0],ids[1]);
    assert.ok(ids.every(id=>pair.includes(`url(#${id})`)));
  } finally {await vite.close()}
});
