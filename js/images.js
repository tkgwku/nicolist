// 16 x 16 px
var STAR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAA' +
    'ABe0lEQVQ4jbWSPUtcQRiFn5m7Gw1W22gKPzBZQgIhojbWaZSQSvBjN/4Fq9hIIGKqqIWdoIWVGqysbERII7sQ7UQwATWwRQJREVbEXGfmpBDCZpe7YOHA' +
    'KWbmzPO+Z2bgPodmGXcfydfzpOoSXjAS/eEMWLt79TwZ7SPt4ZWlIclnEwnPGeUp8AzrRxi8O6CbHA+AJoh6yCXZjKbo4zFLoY3YCoOwBCBLF60gMOYEH3' +
    '5wYCMMBkMKwxGNfOf1bd5PDOsr1xKSQ7pBiit0UyGHVKCsafr/a0VjNPvP7OgU+TLB/Sa4nwT3i+BOCf6KoDOkVb4oTyYxumb44PZQ/I1QKVdEmmOy2l/7' +
    'D8ochhQEVd8WROcUqu01rxCekNfD2wP2AmMvMRhQBujgbV2Aekn7Zt5gITrGpbfIpbcZj0oYLLhHDCdmB9A0Q/Eucisc6h2d/9YneOnWKcVFpPe8SgbMs+' +
    'kXWBaYmr0BGvwiG36OlWTAJC11WwQ0RXvl/C8G2bIkQqHCOgAAAABJRU5ErkJggg==';
var UNSTAR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwY' +
    'AAABl0lEQVQ4jZ1RMWsUQRh9726JP8DO4q4y+AtU0IBNSKloEWKIMLMDh4VNiPWyIGlSSDq5Y7/JFVG5QgVBEEVBiDYKQgpJeX0g1TW77HwpvCOXc29FXz' +
    'Xzvfe9730zQA2SJGnU8QBQK2i1WrsiktRpojqS5BUA4b8SZFl2jeQBgKNut7v4zwYkN4qieK6q+1EUPahLUQkR+Vx1nkUkIpsAtgB8BXABAFU1ArA3leaV' +
    'iLwjWQJQVc0BrKiq4XjCEwCXrLX2b8kGg0FzNBrtl2X5wzm3wwnhvb+uqk9DCI+cc9+rmnu93tVms7lL8qEx5icAcFqQJMlCu91+CcBba9/OvMkqyXt5nq' +
    '93Op1iUj/3C2ma5gAOQwjHFQEKAJ+mm/8wGGPJOfdtPPW29/4WAAyHwzchhDuz4nMGInKZ5C8A8N4/I3kTwEaWZdtpmgaSJ/1+/+JcA1VdU9UD7/0XVX1t' +
    'jHlsjIkBHIrIB1X9WJbl2lyDRqNxn6TJ8/yutfb9pB7H8YuiKGKSDsB6xdq/4b2/MZc8W3N5+n4KbVypv8PDMtkAAAAASUVORK5CYII=';
// 32 x 32 px
var LARGE_STAR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEA' +
    'mpwYAAADl0lEQVRYhdWXXWgcZRSGn/PNzKaxsWk20WJWK7alYOmPf+CV4KVgSEqapJvgDyiIYG+8EMSb6IV45Z0WCr0QQSyJ2WwIothS9bIiSFNIrW2jMc' +
    'EqFetfzf7MnONFdpOJ3U02u5riCx8z8/Gd932/98wMM/B/xqfD+DfVgE2QibK83giHq1t8GF+bedwFDN4UAxyg26VI0ME9+RMc2HgDQppOIAV+QLpunnrw' +
    '5XMEdpKcGmYhFk3y3YYasAy9dg4zQ81QO4PlT/BAPVz1tUAYJBW7TkEi0djNWDPsGIF9Ql4tlkCERZPM1cO37gTCdrrpJCFgMRZz27izMMpD/7kB35FeEX' +
    '8ZKQj89bfBt2MEegdvOiNUxWGIA0FwgMNwKjgniCrQQpe1gkTEM8BuAwl42jK0KngIUt6dsniuhjgHJe6C9PCMANgE79HEEPuB4B8WpaxQOjSDNMWlY/gL' +
    'oRCrEVZm7IDrwFmICrzi9/BGeSmWpY9NvMODbKYjJqAl8cqStcGVxjyiZ7niChyUXr6I72/RxBi3q8cHbgeP2F4QxRoSLvMqIlPAHGOEPCkDLKxekOElO4' +
    '3Zr5iFqBVXjiiPRrnSyKNWuHGNFVELUfsFs5MUbZxnK2lJpUmA/Aj7/E2Muz3s1O2YFcFCIASLt6WckAPxQQKQBDgPmEH4mvPk6JYBLq3LAIAN47iPty3J' +
    '89FuzBy13QsR+DOIXeWo18uR1apWNbBkZIwXtJO3wh0YGpuvROQgmEbkGkPSy/trcdf2InLcrVsWozdbHvE2LM0raAtE4NVGXQt80rqV2uI30HbwHEP/io' +
    'H8KPdrK3eZqyAvVGyiNoPewmP2LpsbNpAIOKxJbti9GBJcRvx5pIIJszYkaqGvYQPqcVjb4srgFhB/iqL9xBPePK8F04iEMSPLbVjzU231x3CcfZpkqri7' +
    '9EYU8H5E/DnOU6BL+pgBKI7yqGtmTHeSjLYurZXgHPbzN2zZdoQ/60pAjbQmS04VCS4g/izHX+1mb1kcIOjnsz9+Y5d/gdP+7HIOlkTaOzm0VgrVE5jkYv' +
    '4HrHAJiz5iwTL0r1mT5WU9heVnscK3mGX5uC7x3Ah7os+x4ldYNMGUjbC91trCKA/bJFeK01h0Crt6nFurra3agqYmBuV3cLMc9XrYLwN8X6uBRD9nuMYu' +
    'd5EPJQdtHdWfhqo/l5FQ9JRD7iCZWoXjkKe4DnSFWV4U4d56ODYEfwM1wpRyzU0yVAAAAABJRU5ErkJggg==';
var LOOP_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAA' +
    'AEIklEQVRYhe2WT2hcVRTGv3PvPJ0OJkEXHUQXJrZRGiYoQi2CzsIiQUycJLwZNRrBZtOA0KXtLhW7srpzI120qOC8TCaFKQScCtFF6cIWJMlALEIjNCa1' +
    'U9KEQfLuPcdF3ivPOJ38m509q/d499zv9+4997sHeBj/96Bd5GjXdQ8R0YsAUgAOArgFYAZApVqtXiuXyytNB+jv73/ScZxTAIatta0AQEQg2phCRCAiiM' +
    'ViEJHL1tqxQqHwc1MAXNc9TkSfM3NCa/0vQRG5D6GUAgAwM5gZWuvztVpttFQq1XYF0NPT82hbW9s5Y8xQLBa7P7mIQCm1AOAKgAUAMQCdAF611rZqrUFE' +
    'sNZCKXVTRI56nndjxwC5XO6bqLgxBlrrS9baTwuFwtU6Kcp13RwRnWHmZ7TWYGYQ0R3f91PFYnFx2wCu6x5n5q+CPQUAX0Q+8Dzv+0bQAJBOp2PJZPKCtf' +
    'bdWCwWQlzN5/NHtgUQFNwNIkoAgIgYAK/n8/mfthKPRjab/ZaZ39NawxgDpdSI53nnomNUvUTHcU4xcwLYWHYRGd2pOAAsLS19qJT6XUQQ1MUZbPrpegAa' +
    'wLDWGkHiL57nfb1TcQCYnp42zPyJtTYsyv2Dg4P9DQFc1z0UnvOg4s/uRjyM8fFxT2tdDU4OtNZ9DQECh9v4qJRZXV29tBeAIH6I+MXhhgAAUkQUmsxvU1' +
    'NT9/aqLiLXIwAHEKmDegAHQwAi+mOv4kHcDR+Y2clkMs83ArgFbPi8iDjNUKfQq4N5Hcf5qxHATGA8IKLOZgAAeBZAuKrLnufdbgRQiezXU67rHtiNYl9f' +
    'X0vk9TWlVOioM9Fx/wGoVqvXNl08wzsVz+Vy5+Px+L1sNvtxJpPpJKLDYV0BKDcEKJfLKyJyObhOoZQ60dvbm9yB+BvGmOFgFV9xHGeMmQkAlFLi+/7WVm' +
    'ytHWNmAICItOzbt+87bLN3EJEvAnCICBPRO0opWGsB4EKxWFyOjtf1JqlUKgupVKqdmV8IrtT2rq6ulzo6Oi7Oz8/7DxLPZrMj1tpjQdOySkTdRKQDF1wT' +
    'kbfn5ubWtlwBAKjVaqNKqZvhVojIW4lEYmZgYGCw3vh0Oh0H8FnYMQFoAfAIAFhrYYx53/O8PzfnPRCgVCrVROQoEd0JIQC0K6XGs9nsguu6H0XHJ5PJk8' +
    'y8P3LkASC80E4XCoWL9XS23NegNyhaa18OWy0RATPDGPPc5OTk/NDQUKvv+0tEFN+cLyJ3ReQKES2KyMmoBzRcgTCKxeJiPp8/opQaAbAc9AfhkdIAsL6+' +
    '/rQxJh5tVEMzA/A4gDd93z9GRCc2z1+3COvF3Nzc9dnZ2bPd3d2/Algjoi8nJiZ+DL7dTqVSjwF4AsAKgBqAvwFYAKKUIqVU1Vp7ulKpNOt+eRjNiX8AU0' +
    'QYjp7wU7cAAAAASUVORK5CYII=';
var NOT_LOOP_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmp' +
    'wYAAAE/klEQVRYheWWTWxUVRTH/+fembZSGKILKmhMMBhMysKNH0BrTTRxYozJGO4dxMAG1FgViQlRiAs/ojEGkGhMDAYXLIhz3wytVEijDVFZqImGENvi' +
    'FwtSFS1gW2dR0nn3HBe8h6+vM4MYw0LPaua9c87vf+8995wH/N+NriTMGPMEEW0FcNg513tFBRhjnmXm17TWCMMQbW1t1+zfv3/isgXk8/nW9vb2lVrrLg' +
    'BLAXSIyCQRjQEYnp6eHhoYGPitHjyTyYCZQURjzrkbgMvYgUKhsDibzW4HsMF7nyMiEP0VLiIQEWQyGYjIESJ6oVQqHTXGbGXm16PnIKJxZl4dBMGPf1uA' +
    'MeZxItrBzPO01rOAUVIAgFIKAMDMEBEopT4VkR6lVOx3hplXxfBLCsjn8625XO497/26TCaTTn4KwBcicoqIsgBuAnCn9z4X+8biRAQAxkVkdRIOAJlmAt' +
    'LwMAyhtT7EzC87576sE6KMMWsA7AGwMN6Z6NwfSsObCrDW9sbwaCUzSqkNzrlSE81MREtEZGGyPpRSIKJXAKxMB+h6WQqFwmKt9Yda62z0KARwTxAEh5vA' +
    'YYx5hpl3aa1nbT8RIQzD61esWPHT6OjosWSMqpcom81uZ+Z5wIVtF5Fe59xnzeDW2i3MvDPeMQDnROQWACdFBFprENGrSNXdHAH5fL4VwIZ4FVrrr4IgeP' +
    'dScO/9Gyn4aufccWbe5r0HEcF7v6hYLBaaCliwYMEd3vsccLHidzWDF4vFp5NwIvo9qvbvAKBcLgda63PRzYGIPNBUgFKqK3Gvw2q1eqgZPAzD3Ul4rVa7' +
    'CE/YUKJf3NZUgIgsjYtHRH4YHBz8ox7cGFMXfuDAgW/r5DyWELDMGNPSUACAjigIUX+fY9bap0Rkd+LMJwB01YNHNhH/YOYsM9/cTMAkgPgKZdMvjTFPMv' +
    'ObcZECmBSRrlKpdKIBHJRoCkSEWq12tqEAERmLEgPA8jRcRN5KwCeighttBI9sWZQbRDR+8ODBXxoKADAcnxcRLTHGLAMudMYUfNJ7390Ins/nc4m/3fFA' +
    'AjCc9JvTisMwHGppaREAxMxQSj1sjDnNzG+n4F2VSmWkHtxau09E1ltrN58/f/4jIroduHCtlVIfJ33rTkNr7ZCI3B2N12kRuSrRVqdmZma6+vr6hhvE3u' +
    'u9H1RKQSn1PjMDwNpoB0REOoIgOBP7123F3vsXE3UwC87M3Y3gke3UWsdNh4lorVIK3nsA2JeENxRQqVSOaq2HEiIAAMx8fxAE3zQiW2s3ee87o6KvEtGa' +
    'WLxSqioiz6Vj6k5Da+1jADYnRyoAENFdnZ2dP4+MjMy5cj09PW3z588fUEq1R3GtcX7vPUSkWC6Xv07HzdkBY8yjzPxOrDwKjrvYjcxcttaOGWM2JuM6Oj' +
    'q2MfOitOho9S9VKpUP6i12lrcx5hER2ZOY51Misg7A8977ldFIhYiAmRGG4fL+/v7vjTELiehXImpLA0Rkgog+F5HTIrKtYQ1Ya29NwgFURaTHOXfYObdK' +
    'KbUJwHj0fRD7xEd4XRiGbckP1UT9XM3M99VqtY1EtKXhEYhIPl4ZgCqAbufc8fh9EAR7nXPXKqUeJKK9Sqn1/f39J6J3o5lMZgeAEwBOAhgDMA5gioimiS' +
    'jMZrNnvfdzJuvFIzDGLCWiTwBM12q1Yl9f3/G08z80MsaoIAj8v5TvP2Z/An2SEK7JPoIZAAAAAElFTkSuQmCC';
var WIDEN_DATA_URL = 'data:image/png;base64,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';
var NARROW_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwY' +
    'AAAFKUlEQVRYhe1WTWxUVRg95775gUppBUukCNaG0CYEtorGTTHBGMJP6YahpLrpVsICI0FHElOJMeJGks6qwgRsDSmBGIOkC0hIidGVGGaiUQIqbUhLZ6' +
    'CVYd69x8W8V17H/iCJrvg273v33XfP9537ne9e4Ik9sf/ZJDH6zoGBAW9wcLAZQLNzzoQfjDGURJKqHg/96DhJQ1KSGIJE1wjHjTEOwGhtbe2PmUymwFQq' +
    'tcH3/R6S6wFYAP4cwROAgueCWYagQXDV/pgx5suGhoZMzPf9jSQ3SlpO8j6AyQiQFgKbBfwhevCUFLJEAIsB1EvaNjY2djYWobAE4KqkYQA2pFqSC9eKUO' +
    'mCdyPJRfAdyRDIhZgkwzWMpNdIrgWwwlq7KoYK7aVg0aH6+vojAOIA4itXrpwMFnpsW79+PYeHhxNLly61t27dUqFQSAJYAyBhjKmPGWOcc04BCz6AmmKx' +
    '+IaktcVi8XJLS8ulw4cPz1UX81o6nTZnzpzZIOnlkZGR642NjReLxeJUsC1GUo2JykISp6amlgHYDGCHpHQul3u9u7s7/hjgsXw+v9la+7Fzrstau310dH' +
    'RFsKWV/TAmYQJ/OgjP8+5IGpO0BEAzgIMTExO7/k0Q3d3d8Vwut9M5956kVgDLADwgWQRgw9r0fd+F2hVJAXBNTU1Fz/N6SV6WVAKwGsC+QqHQnk6nEwuB' +
    'd3V1LZqYmNgFYD+AJpI+ye9IHmtubr6DiIxJGhM0EEaZOHny5K+JROIDkucllUiuArAvn89vmy+Irq6uRaVSKUVyP4DnADyQdCEWix3q7++/FkwL663SmI' +
    'Bp7c7Q/IkTJ24kk8kekhcA3AewWtKBfD6/Y2BgwKsGT6fTiVKp9KaktwE0SpoieZ7kh9ls9rdI1or6JlRAEMgMyR0/fvyPRCLxEYArABJBVlsHBwefrg4g' +
    'l8s1StoK4FkABsA3yWSyp7+//+ZcjM22BaZ6kiQvGA/Uo/u1tbXlWdazkvzgHwG4Z629Oxd4MG8m4HTPDKyzs/OFcrmclvRSUAu/AOjv7e0tVi9WV1c3Qv' +
    'IMgNGgS+4ql8sH9uzZs7I60AgDqlbBdAB79+5dUy6XDwJ4FUCS5A2Sn7W2tl6srhcAyGQy5Xg8/hXJLIA7AGpJdvi+fyiVSj0f9htJ00k754xxzplIHyAA' +
    'pFKp5nK5/D6ANklxANeNMT0tLS3n5uuK2Wx2MhaLfQ7gGIARAE9J2mKtTXd2dq4LiY5imaqqdOPj40ustW9JekVSnOQNAJ+uW7fu20dpydlsdrKxsbFP0l' +
    'EAN0nGAbxord0zPj6+BJWzZZrtfxTd1NTUYpKLJI2T/NkY80ldXd28mVfb0aNH/6qvrx8geQTAVQB/ArClUikRsM1KvoEKwh8lsaamZkLSWZJfGGPe3blz' +
    '57lMJjNb1c9rmUym3N7e/rWkd0j2AhjcvXv3RIQBAEAMFfkIAI0xplQquba2tiu5XO77TZs2PQCA2RrPo1pHR8e1hoaG3O3bt3Xq1KkZhx8AxAJ5SdJiSV' +
    'sKhcLyoaEhktTp06cBwITyjN50AIQXk5DBGde16BUMD7eaADYCWCLprjHGxIwxv1trx1C5JrWicgKiqiUgOhb9Vj0vDDL6PXraBoXtkZyUNBbzPO8n59xp' +
    'ANsBLA8yY6iOufz5LJgTgs7wg293SV7yPO8HApVTzPf9ZknPRPcoercMx6y1074xRrPNtdbK8zxaa2WMkXOOxhgFZ40leS+RSIz09fUVFkrmif3n9jcQAx' +
    '8mizxdVwAAAABJRU5ErkJggg==';
var PREV_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAA' +
    'ACWklEQVRYhe2VP4gTQRTGvzczkgOFCyfEwj+YSosTkRQWJ0YhKS+QxI0WdlqolSBYaKl4hQgKopxYC+5skmZLmwgnNum0THOVsTyOLUxmns0FQjLxstnk' +
    'RPBX7+z78X1vd4D//GVowe8XnufdBnAVwFet9asDE6jVausA3hhjTggh0O/3QUTFRqPxafg5Ne/BnudliWjTGFOUUkJKyQCglCJmXgOwGIFcLncom80+Ia' +
    'KHzEyDwcMIIcbOzUXA87xrRPTaWnsMAIhobDgAWGvnK1Aqlc6kUql31trLUkoIIZyDB8wtgXw+v5TJZDaI6D4AuOKeltgC1Wr1ppTypbX26KSoJ5GognK5' +
    'vKqUem+tvUhE+8btYqYKisXi4XQ6/RzAXSKClJKZZ0s8dgKe590iohfMvBw3bhdTJ1CpVM4qpT4YYy4opQAg8fBJOAWUUlvMvJIkbheuCsYyyefzR4wxK6' +
    'OREy3m2hgTaLVau0KIz8YYwtBlNc8k/igAAFrrK0T0CMAvZl7ole0UAMBBEGz0er2TRPRxNI2Zhzm+gkkCAIBms/nT9/0bANaY+ZsxhijBMky1hC7q9foX' +
    'rfU5IrrDzDuz1hI7gVGCINjsdrvHAbzdk0heS9wDrVZrV2t9z1q7ysxbcfZj5gpc1Ov171rrSwCuA/hhrd1XJHEFE0T8TqdzCsAzADbufiQWAIB2u90Lgu' +
    'BxFEVZIgon1eKSm4vAgDAMt33fX2fmIjN3hmvZ+5PujJ5Z6F+uVqs9APC03+8vKaU4iqLTYRhuL3KmC1Uul88XCoXlgx78b/Abiwj8ZCeQkxsAAAAASUVO' +
    'RK5CYII=';
var NEXT_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAA' +
    'ACW0lEQVRYhe2VMYgTURCGZ957QojCcVqksZEUWggiKRQEY5G0gV0yW9lZnF7hWZ0gNlZaKHaKaGflPkOIWqkgEU5sYqOCTao7wVgeQozJzlhcAudm926T' +
    'bM7m/m4f8/b/3vzzdgH29Z+FUYtEtAIAZwHgnbX2MQDIngG4rlsSkTfGGGBm0FpvAMCy7/sv5wGgxhaUOmeMAUQUrbUAwNEgCF54nveaiI7tBUB4SbTWIi' +
    'JlRGxXq9U7hULhwNwAmDmyEBEFtiK7ns/n14moOheAiA5slyilBAByzGyJqFmpVI6nCpBQorUWRDyfyWS+EdH9YrGYSQUgLoI4EAAQEbmWy+U2iOjizAC7' +
    'RBD9kq1YjjDzUyL66DjOyakBJuzAdo1iOWOM+UxED8rl8sGJAabpQBhkeGOuLC4ufieiSxMBpCVEFERcYOYnnud9cl33RCKAGSIYk4iMPmKnjTFriQDSEC' +
    'KGnyUIgsPFYvFQuNbMA0Dkn58nBkEASqn3zWbzV7h2bjMwBEEA+IOIN6y1F6JqxjqglAqfYBphEASgtX7W7/ev1uv1n3GFYwDMPJZhYldEHAwGoJT6AgBL' +
    'vu9/2G1Pah0YtnsTEVettY+S7ktjCHEI/LDT6axGDdpEABNEMJruNWZeqtVqXycxjgVIEAEyMyilfgDAirXWn8Y4FmAniQgiIiPi7Xa7favVavVnMY8EGA' +
    '5TWKNr9arX6y03Go31WY1jAQBgU0RGc4DDmWiLyGXf99+mZRwL0O12n2ez2buDwQCNMb8B4Ka19l7axjuqVCotOI5zKgpwX2nrL1a89wlV6bvAAAAAAElF' +
    'TkSuQmCC';
var CLOSE_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYA' +
    'AADZ0lEQVRYhe2Wz2skRRTHv6+qMUHn4L9gyMWrXo2SQEDX3YmZth5CzIquC6IHQWX9H3bBBQ8eZFeiiyJd3TMZsz9AlGSNBw8ieNIg6kXJwZsevHS956U' +
    '79vR0OjNJxMu+S0hR/T6fqnr1poB78T+HbRpcWVl5sNPphP39fTktkHPuofn5+fv39vb+qo6bhomXZ2Zm/pibm/uz1+udOQ04Mw9F5JfZ2dlf6znHBIhoH' +
    'UBERLNRFN1yzj15ErhzbktEutZaiMh91tqFVgEA2yICAFoI3Ynj+Oxx4ap61hij5Vie58NWgSRJ1o0xOyJCpYS1dss5150GzszDCpyKRT0/GAy+aRUAEJI' +
    'kWapIgIgAYBjH8cokcOfcpoh0jTEo4US0lqbpx/W51JLHOOd2VHWhXAUA5Hne7ff7Wy3woap2qysnojXv/SeNkBYB8d4vGWO+rh5HFEWfxXH8VNMHzNxvg' +
    'J8/DH6UAADkSZIsGmN2azVxu36dmNmLyGpZcCICVb3gvb/RBjhK4ECCiL6q7cStXq93DgCcc5+KyLMlPIRAAC5mWfbBUcnbamBM1jn3haouGmNARFBVAbA' +
    'rIk8UBYcQAowxL3vvr0+SdBqBUmJbVR+vFiaKXRERIqIXvfcbEyecUkC890tEtFPAtYQX/780Dfw4AgAQAPyuqiODRBSI6Ldpk00t4Jz7UETWiKi6cqiqJ' +
    'aLPnXNP/2cCzLwhIuettQBAqkoAfiz+gohARDenadsTCzDzjRDCC9ZaBaAhBAB4NUmSh4lop7j35Q/YxG17olvAzB+FENYLOEIIRESvpWn6XjHFMvO2iIy' +
    '07RDCuSzLbp5IgJk3ipWjSAoAr2dZ9m5talRIPFbpEwghnMmy7M5h+VuPgJmv1bfdGPNGAxz4t2PuVo/DWnubmQ99WR0qwMzvhxAuVLfdGPOm9/5qi3Puv' +
    'V80xtyttm0AB227Ho1HUMAvNsDfaYGP5HXOfVm07WpNPJNl2ciLaEyAma+EEN6qwS95769MCC9jrG2rKvI8f3QwGHx3MKnhw1fKe15U+9vHgAPj7wmoKqI' +
    'oem7Esv6Vqn4vIsjzHMaYS2maXj4GvIxQvCfu5nkOIhIR+bY6YewIlpeXH+h0OgtE9HO/3//pBPCRWF1dfURV/97c3PzhtHLei1OJfwBF5uKlYMgSEgAAA' +
    'ABJRU5ErkJggg==';
var JUMP_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAA' +
    'ADrklEQVRYhe1WQWhcVRQ9970/f/pFg0WTaK2Cg+DGtmtRGBciWUxCk8wPLiriMqgVFFpUWrCiiO6Eim7ETd285I+BoODCMoUubXGjbgomKIiRYJpiNPP+' +
    'vS7m//HNz7yZXxtXeuHxLu/d+8759917/wP+60L7dVCj0bgtiqJXABxRSvXtiQiJyO/MfGF5efnLf4VAs9l8S0ReK4IXiKDT6RxcWVn5LV/zW9+kEFGViJ' +
    'APpRSISNwhIgjD8JjrF+wXgZ2dnXeiKDosIkeJiEXkLiK6R0TEIQlmvnMogUajcXcYhg9rrYddz6Yx5lt3YXV19VcATwPA9PT0ZBRFVx3sniilKl4Cc3Nz' +
    'x4MgSNI0JWYegg/EcfyBMeb54vrs7OxEEARXANwLQNDNsx4TEenD7MsBrfVZAKS1lhEDAJr1ev2A61+v12+vVCqXARxywK/DSfahBAAcdHRi5oEjTVMA+K' +
    'rdbv+RG09NTVUnJycvi8hDRJSDb1prj7vRJCL/FRBRbkkArjLzuSAItGsjIkREm8aYi+6HjI2NXcwSMAe/Ya19bG1tbb1WqzEAlRG55iUAoEdVRH5OkuQz' +
    'lJA4jr9g5keVUkLdeut0Op16q9X6HgBqtdpJEXlZa/21MeZSKQJEVKpJLSwsJMz8lFJKAJCIsLX2yVardSW3McacB3B+kH8xB9xsHUkgjuOP0zSddcBhrZ' +
    '1OkuTSKN9cvI1oVATiOH6fmZ/TWgsAZPd7IkmSzwFgfn7+CaXUmyLyw8bGxmK73b4x6JxhEfC26WazeY6ZX8zB0zQlIlpcWlq60DtYqU8APC4iJyYmJl7w' +
    'neUFIaKBe3EcLzLzGRdcKfW6MebDgv+h/J8A4MGyBMrkwKtB0L25DPxdY8zbA+ysQ6ZaioDbu30RAPAdM8NaS0qpj4wxpz121tEPeGz2NKKREbDWPhMEwb' +
    'Na65+MMZ/6DhYRq5TKPyosRaBAZiCBVqv1C4D3fH6O7OYRLfZ/V7w5gFt8LRHRTjYDgPbZeatgWBmWlD8d3XsFxSR0Xy+3+l50kzAqRWCfpePo3jL0VgGA' +
    'B+I4fgNAhYiUiKjsT1ecqevap7OIHHaqoO8N4CXgiAC4D8BZ4O/+4JsH6Rm4ZIS8VdC3ISI/AjiSXb/cRBrsMcwIETODiK7tdRlAwFp7KgiCR9I0vR/olV' +
    'A/krPm6FIYnOtE9M3u7u5LpZkDwMzMzB0AsLW11W1jYSjb29tcrVYliiJZX1+X8fFxbrfbLuD/8o/kL6/r0h5ZDjXcAAAAAElFTkSuQmCC';
var CHANNEL = './../img/channel.jpg';
